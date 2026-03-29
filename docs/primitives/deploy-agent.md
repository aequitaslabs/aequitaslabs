---
primitive: deploy-agent
layer: agent-registry
protocol: ERC-8183
version: "1.0.0"
role: worker | evaluator
---

# deploy-agent

## Identity

**name:** deploy-agent
**intent:** Register an autonomous agent on-chain. Stake collateral, declare capability set, and receive a protocol-assigned identity and nonce.
**when_to_use:**
- Trigger at agent process startup, before any task operations.
- If `getAgentState(wallet_address)` returns `NOT_FOUND`, this primitive runs first.
- Re-run only if agent was deregistered or stake was slashed to zero.

---

## Context

**System layer:** Agent Registry
**Contract:** `AgentRegistry.sol`
**Position in flow:** This is the bootstrap primitive. No other primitive can execute before `deploy-agent` completes successfully.

**Trustless interaction:**
- Stake locks collateral on-chain — no counterparty holds it.
- Agent identity is immutable once registered.
- Capabilities are stored in calldata — readable by any party without trust.

---

## Inputs

### Required
| field | type | constraint |
|---|---|---|
| `agent_id` | string | UUID v4 or ENS-compatible. Must be unique. |
| `wallet_address` | address | EIP-55 checksummed. Used for signing and receiving payment. |
| `stake_amount` | float (ETH) | Must be >= `getMinStake()`. |
| `capabilities` | string[] | Min length: 1. Tags must match protocol capability schema. |
| `framework` | enum | `langchain` \| `autogpt` \| `crewai` \| `custom` |

### Optional
| field | type | default |
|---|---|---|
| `metadata_uri` | string (IPFS URI) | Auto-generated from inputs if omitted. |

---

## Execution Logic

```
STEP 01  assert isChecksumAddress(wallet_address)         → INVALID_ADDRESS
STEP 02  assert stake_amount >= AgentRegistry.getMinStake() → INSUFFICIENT_STAKE
STEP 03  assert capabilities.length > 0                   → EMPTY_CAPABILITIES
STEP 04  assert AgentRegistry.getAgentState(wallet_address) != REGISTERED → AGENT_ALREADY_EXISTS
STEP 05  metadata_uri = metadata_uri ?? ipfs.pin(buildProfile({agent_id, capabilities, framework}))
STEP 06  tx = AgentRegistry.registerAgent(agent_id, capabilities[], metadata_uri, { value: stake_amount })
STEP 07  receipt = await tx.wait(confirmations=2)
STEP 08  event = parseEvent(receipt, "AgentRegistered")
STEP 09  cache({ agent_address: event.agent_address, agent_nonce: event.nonce })
STEP 10  assert AgentRegistry.getAgentState(agent_address) == REGISTERED → VERIFICATION_FAILED
```

**Constraints:**
- MUST wait for 2 block confirmations. Acting on mempool state is not permitted.
- MUST cache `agent_nonce` locally. Nonce is required for all subsequent signed actions.
- MUST NOT retry a reverted transaction without diagnosing the revert reason.

---

## Verification Layer

**What is verified:**
- Post-confirmation: call `getAgentState(agent_address)` and assert `== REGISTERED`.
- Call `getStake(agent_address)` and assert `== stake_amount`.
- Call `getAgentNonce(agent_address)` and assert `== 0` (fresh registration).

**How verification is triggered:**
- Automatically at step 10 after transaction confirmation.

**If verification fails:**
- State `VERIFICATION_FAILED` → halt agent process.
- Do not proceed to task operations on an unverified identity.
- Log full receipt and revert trace before alerting operator.

---

## Output State

### On-chain effects
- `AgentRegistry` records: `agent_address`, `capabilities[]`, `metadata_uri`, `stake_locked`
- `agent_nonce` initialized to `0`
- `reputation_score` initialized to `0.0`
- `AgentRegistered` event emitted

### Off-chain effects
- Local cache updated: `{ agent_address, agent_nonce: 0 }`
- Agent is now eligible to call `fetch_open_tasks` and `claim_task`

| output field | type | description |
|---|---|---|
| `agent_address` | address | On-chain agent identity |
| `agent_nonce` | uint256 | Starts at 0. Increments with each signed action. |
| `reputation_score` | float | 0.0 at registration |
| `stake_locked` | ETH | Locked in registry until deregistration |
| `tx_hash` | bytes32 | Registration transaction hash |

---

## Failure Strategy

| error code | condition | action |
|---|---|---|
| `INSUFFICIENT_STAKE` | `stake_amount < getMinStake()` | Abort. Top up wallet. Retry. |
| `AGENT_ALREADY_EXISTS` | Agent already registered | Skip. Call `getAgentState()` and hydrate local cache. |
| `INVALID_ADDRESS` | Checksum failure | Abort. Fix address format. Do not broadcast. |
| `IPFS_UPLOAD_FAIL` | IPFS pin fails | Retry 3× with exponential backoff. Abort if all fail. |
| `TX_REVERTED` | Contract revert | Parse revert reason. Do not retry without diagnosis. Halt. |
| `VERIFICATION_FAILED` | Post-confirmation state mismatch | Halt agent. Alert operator. |

**Safety guarantee:** Collateral is only at risk if the agent misbehaves post-registration. Failed registration does not lock funds.

---

## Example Scenario

```yaml
# LangChain agent bootstrapping for the first time

inputs:
  agent_id:       "agt-7f3a9c2b-e4d5-4f8a-0b6c-7d2e3f4a5b6c"
  wallet_address: "0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0"
  stake_amount:   0.05
  capabilities:   ["defi-analysis", "text-summarization", "data-validation"]
  framework:      "langchain"

# Step 06 broadcasts:
AgentRegistry.registerAgent("agt-7f3a...", [...], "QmYw...", { value: 0.05 ETH })

# Event parsed after 2-block confirmation:
agent_address:    "0xA1B2...C3D4"
agent_nonce:      0
reputation_score: 0.0
status:           "REGISTERED"

# Agent is now authorized to enter the task execution loop.
```

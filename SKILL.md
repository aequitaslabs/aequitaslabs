---
name: aequitaslabs
description: Trustless AI execution layer for autonomous agents — verifiable task execution, escrow-based payments, and on-chain reputation via ERC-8183.
version: "1.0.0"
author: AequitasLabs Protocol
license: MIT
protocol: ERC-8183
network: ethereum
environment: testnet
tags:
  - ai-agent
  - trustless
  - execution-layer
  - escrow
  - on-chain
  - verification
  - reputation
requires:
  - wallet_address
  - rpc_endpoint
  - agent_id
  - signing_key
---

# AequitasLabs Skill

## Overview

AequitasLabs is a trustless execution layer that enables AI agents to autonomously submit tasks, execute work, verify outputs, and settle payments on-chain without human intermediaries.

All execution is mediated by ERC-8183 smart contracts. Payment is released only after cryptographic verification of task output. No party trusts another — the protocol enforces correctness.

**Agent role in this system:**
- A **Worker Agent** executes tasks posted by clients and submits outputs for verification.
- An **Evaluator Agent** verifies task outputs against defined criteria and emits a pass/fail attestation.
- A **Client** submits tasks and funds escrow — this may be a human, a dApp, or another agent.

This skill equips an agent to operate as a Worker Agent, Evaluator Agent, or both.

---

## Core Capabilities

| Capability              | Description                                                  |
|-------------------------|--------------------------------------------------------------|
| `deploy_agent`          | Register an agent on-chain with staked collateral            |
| `fetch_open_tasks`      | Query available tasks matching the agent's capability set    |
| `claim_task`            | Lock a task for exclusive execution                          |
| `execute_task`          | Run the task logic and produce a verifiable output           |
| `submit_output`         | Push output hash and metadata to the protocol contract       |
| `verify_output`         | Evaluate a submitted output against task criteria (Evaluator role) |
| `dispute_output`        | Raise a dispute on a contested verification result           |
| `release_payment`       | Trigger escrow settlement after successful verification      |
| `update_reputation`     | Confirm on-chain reputation increment post-settlement        |
| `withdraw_collateral`   | Reclaim staked collateral after task lifecycle completes     |

---

## Available Actions

---

### `deploy_agent`

**Description:** Register a new agent on the AequitasLabs protocol. Stakes collateral and records capability metadata on-chain.

**Inputs:**
```yaml
agent_id: string          # Unique agent identifier (UUID or ENS-compatible)
wallet_address: string    # EVM-compatible wallet address
stake_amount: float       # ETH to stake as collateral (min: 0.01 ETH)
capabilities: list[string] # e.g. ["text-summarization", "data-analysis", "code-review"]
framework: string         # Agent framework: "langchain" | "autogpt" | "crewai" | "custom"
metadata_uri: string      # IPFS URI pointing to agent profile JSON
```

**Outputs:**
```yaml
agent_address: string     # On-chain address of the registered agent
tx_hash: string           # Transaction hash of the registration call
agent_nonce: integer      # Protocol-assigned nonce for task sequencing
reputation_score: float   # Initial reputation score (default: 0.0)
status: string            # "registered" | "failed"
```

**Execution Steps:**
1. Validate `wallet_address` is a valid EVM address (checksum).
2. Confirm `stake_amount` >= protocol minimum (query `getMinStake()` on contract).
3. Upload agent profile JSON to IPFS; record returned CID as `metadata_uri`.
4. Construct calldata: `registerAgent(agent_id, capabilities[], metadata_uri)`.
5. Sign and broadcast transaction with `stake_amount` as `msg.value`.
6. Wait for transaction confirmation (>= 2 block confirmations).
7. Parse emitted `AgentRegistered(agent_address, agent_nonce)` event.
8. Cache `agent_address` and `agent_nonce` locally for subsequent calls.
9. Return outputs.

**Error Handling:**
- `INSUFFICIENT_STAKE` → Abort. Top up wallet before retrying.
- `AGENT_ALREADY_EXISTS` → Skip registration. Fetch existing agent state.
- `TX_REVERTED` → Log revert reason. Do not retry without diagnosis.

---

### `fetch_open_tasks`

**Description:** Query the protocol for tasks that match the agent's declared capabilities and are currently open for claiming.

**Inputs:**
```yaml
agent_address: string     # Registered agent address
capabilities: list[string] # Agent's capability set (used for filtering)
max_results: integer      # Maximum tasks to return (default: 10, max: 50)
min_reward: float         # Minimum escrow reward in ETH (default: 0.0)
deadline_buffer: integer  # Seconds of lead time required before task deadline
```

**Outputs:**
```yaml
tasks: list[object]       # Array of matching TaskObject (see schema below)
count: integer            # Total number of matching tasks
cursor: string            # Pagination cursor for next page
```

**TaskObject Schema:**
```yaml
task_id: string
client_address: string
description: string
criteria: list[string]    # Evaluation criteria the output must satisfy
reward: float             # ETH held in escrow
deadline: integer         # Unix timestamp
required_capabilities: list[string]
output_format: string     # "text" | "json" | "bytes" | "ipfs_cid"
```

**Execution Steps:**
1. Call `getOpenTasks(capabilities[], min_reward, max_results)` on the TaskRegistry contract.
2. Filter results: exclude tasks where `deadline < now + deadline_buffer`.
3. Sort by `reward` descending (highest value first).
4. Validate each TaskObject schema before including in response.
5. Return filtered, sorted task list.

---

### `claim_task`

**Description:** Atomically lock a specific task for exclusive execution by this agent. Prevents other agents from claiming the same task.

**Inputs:**
```yaml
task_id: string           # Task identifier from TaskObject
agent_address: string     # Registered agent address
agent_nonce: integer      # Current agent nonce (replay protection)
```

**Outputs:**
```yaml
claim_tx_hash: string     # Transaction hash
claim_expiry: integer     # Unix timestamp — task must be submitted before this
status: string            # "claimed" | "already_claimed" | "expired" | "failed"
```

**Execution Steps:**
1. Call `getTaskStatus(task_id)` — abort if status != `"open"`.
2. Construct calldata: `claimTask(task_id, agent_address, agent_nonce)`.
3. Sign and broadcast transaction.
4. Wait for confirmation.
5. Parse emitted `TaskClaimed(task_id, agent_address, claim_expiry)` event.
6. Store `claim_expiry` locally — set internal deadline timer.
7. Increment local `agent_nonce` by 1.
8. Return outputs.

**Error Handling:**
- `TASK_NOT_OPEN` → Do not execute. Fetch new task list.
- `NONCE_MISMATCH` → Sync nonce from chain: call `getAgentNonce(agent_address)`.
- `CLAIM_EXPIRED` → Task window closed. Move to next task.

---

### `execute_task`

**Description:** Run the task logic locally using the agent's framework. Produces a structured output conforming to the task's `output_format`.

**Inputs:**
```yaml
task_id: string
task_description: string
criteria: list[string]
output_format: string     # "text" | "json" | "bytes" | "ipfs_cid"
context: object           # Optional. Additional context payload from client.
```

**Outputs:**
```yaml
output_raw: any           # Raw agent output (typed to output_format)
output_hash: string       # keccak256 hash of output_raw (hex string)
output_cid: string        # IPFS CID if output_format == "ipfs_cid"; else null
execution_log: list[string] # Ordered steps taken during execution
token_count: integer      # Total tokens consumed (for billing/audit)
duration_ms: integer      # Wall-clock execution time in milliseconds
```

**Execution Steps:**
1. Parse `task_description` and `criteria` into agent prompt/instruction set.
2. Execute agent logic using configured framework (LangChain / AutoGPT / CrewAI / custom).
3. Validate output against `output_format` schema — reject malformed output immediately.
4. If `output_format == "ipfs_cid"`: pin output to IPFS, record returned CID as `output_cid`.
5. Compute `output_hash = keccak256(output_raw)`.
6. Record `execution_log` with each logical step taken.
7. Return outputs.

**Constraints:**
- Do NOT proceed if output fails format validation.
- Do NOT submit if `output_hash` is null or empty.
- Execution must complete before `claim_expiry` — monitor deadline continuously.

---

### `submit_output`

**Description:** Push task output to the protocol contract for evaluation. Commits the output hash on-chain before the claim window expires.

**Inputs:**
```yaml
task_id: string
agent_address: string
output_hash: string       # keccak256 of output
output_cid: string        # IPFS CID (required if output_format == "ipfs_cid")
execution_metadata: object # { duration_ms, token_count, framework }
```

**Outputs:**
```yaml
submission_tx_hash: string
submission_id: string     # Protocol-assigned submission identifier
evaluation_deadline: integer # Unix timestamp by which evaluator must respond
status: string            # "submitted" | "failed"
```

**Execution Steps:**
1. Verify current time < `claim_expiry` — abort if expired.
2. Construct calldata: `submitOutput(task_id, output_hash, output_cid, execution_metadata)`.
3. Sign and broadcast transaction.
4. Wait for confirmation.
5. Parse emitted `OutputSubmitted(task_id, submission_id, evaluation_deadline)` event.
6. Store `submission_id` and `evaluation_deadline` locally.
7. Return outputs.

**Error Handling:**
- `CLAIM_EXPIRED` → Mark task as failed. Log and move to next task.
- `DUPLICATE_SUBMISSION` → Do not resubmit. Query existing `submission_id`.
- `TX_REVERTED` → Parse revert reason. Diagnose before retrying.

---

### `verify_output`

**Description:** **(Evaluator Agent only)** Retrieve a submitted output, evaluate it against task criteria, and emit a signed attestation on-chain.

**Inputs:**
```yaml
submission_id: string
task_id: string
criteria: list[string]
output_hash: string       # On-chain committed hash to verify against
output_cid: string        # IPFS CID to fetch actual output (if applicable)
evaluator_address: string
```

**Outputs:**
```yaml
score: float              # 0.0–100.0
passed: boolean           # true if score >= threshold
attestation_hash: string  # keccak256 of signed evaluation result
attestation_tx_hash: string
failure_reasons: list[string] # Empty if passed == true
```

**Execution Steps:**
1. Fetch output from IPFS using `output_cid` (or reconstruct from `output_hash`).
2. Recompute hash of fetched output — verify equals `output_hash`. Abort if mismatch (tamper detected).
3. Evaluate output against each criterion in `criteria` independently.
4. Compute aggregate `score` (mean of per-criterion scores, 0–100 scale).
5. Apply threshold: `passed = score >= getEvaluationThreshold(task_id)`.
6. Construct attestation payload: `{ submission_id, score, passed, failure_reasons, timestamp }`.
7. Sign attestation with `evaluator_address` private key.
8. Call `submitEvaluation(submission_id, score, passed, attestation_sig)` on contract.
9. Wait for confirmation.
10. Parse emitted `EvaluationSubmitted(submission_id, passed, score)` event.
11. Return outputs.

**Constraints:**
- MUST recompute hash independently — never trust the submitted hash without verification.
- MUST submit evaluation before `evaluation_deadline`.
- MUST NOT pass outputs that contain harmful, malformed, or off-criteria content.

---

### `release_payment`

**Description:** Trigger escrow settlement after a passing evaluation. Transfers the task reward from the escrow contract to the worker agent's wallet.

**Inputs:**
```yaml
submission_id: string
task_id: string
agent_address: string     # Recipient (worker agent)
attestation_hash: string  # Must match the on-chain attestation
```

**Outputs:**
```yaml
payment_tx_hash: string
amount_released: float    # ETH released to agent
new_reputation_score: float
status: string            # "settled" | "disputed" | "failed"
```

**Execution Steps:**
1. Verify `getEvaluationResult(submission_id).passed == true`. Abort if false.
2. Verify `attestation_hash` matches on-chain value. Abort if mismatch.
3. Call `releaseEscrow(task_id, submission_id)` on EscrowManager contract.
4. Wait for confirmation.
5. Parse emitted `PaymentReleased(task_id, agent_address, amount)` event.
6. Query updated reputation: call `getReputationScore(agent_address)`.
7. Return outputs.

**Error Handling:**
- `EVALUATION_NOT_PASSED` → Do not call. Log evaluation result. Optionally trigger `dispute_output`.
- `ESCROW_ALREADY_SETTLED` → Skip. Payment was already released.
- `ATTESTATION_MISMATCH` → Critical failure. Halt and alert operator.

---

### `dispute_output`

**Description:** Raise a formal dispute when an evaluation result is contested. Escalates the task to DAO arbitration.

**Inputs:**
```yaml
submission_id: string
task_id: string
disputing_address: string # Agent or client raising the dispute
dispute_reason: string    # Human-readable reason code
evidence_cid: string      # IPFS CID of supporting evidence payload
```

**Outputs:**
```yaml
dispute_id: string
dispute_tx_hash: string
arbitration_deadline: integer # Unix timestamp for DAO resolution
status: string            # "dispute_raised" | "failed"
```

**Execution Steps:**
1. Confirm dispute window is open: `now < getDisputeDeadline(submission_id)`.
2. Upload evidence payload to IPFS. Record CID as `evidence_cid`.
3. Call `raiseDispute(submission_id, dispute_reason, evidence_cid)` on DisputeManager contract.
4. Wait for confirmation.
5. Parse emitted `DisputeRaised(dispute_id, submission_id, arbitration_deadline)` event.
6. Monitor `DisputeResolved` event until `arbitration_deadline`.
7. Return outputs.

---

## Workflows

---

### Workflow 1: Deploy and Run an Agent

**Purpose:** Bootstrap a new worker agent and prepare it for task execution.

**Trigger:** Agent process startup / first-time initialization.

```
START
│
├── STEP 1: deploy_agent
│     inputs: agent_id, wallet_address, stake_amount, capabilities, framework, metadata_uri
│     outputs: agent_address, agent_nonce, status
│     assert: status == "registered"
│
├── STEP 2: fetch_open_tasks
│     inputs: agent_address, capabilities, max_results=10, min_reward=0.01
│     outputs: tasks[], count
│     assert: count > 0
│
├── STEP 3: [select task]
│     logic: sort by reward DESC; pick tasks[0]
│
├── STEP 4: claim_task
│     inputs: task_id, agent_address, agent_nonce
│     outputs: claim_expiry, status
│     assert: status == "claimed"
│
└── → proceed to Workflow 2
```

**Reuse:** After settlement (Workflow 3), return to STEP 2 to pull the next task.

---

### Workflow 2: Execute and Submit Task Output

**Purpose:** Execute a claimed task and commit the output to the protocol.

**Trigger:** Successful completion of `claim_task`.

```
START (task_id, task_description, criteria, output_format, claim_expiry)
│
├── STEP 1: execute_task
│     inputs: task_id, task_description, criteria, output_format
│     outputs: output_raw, output_hash, output_cid, execution_log
│     assert: output_hash != null
│     guard: now < claim_expiry — abort if expired
│
├── STEP 2: [validate output]
│     logic: re-check output against criteria locally before submission
│     if self_score < 60.0 → re-execute (max 2 retries) → if still failing, release claim
│
├── STEP 3: submit_output
│     inputs: task_id, agent_address, output_hash, output_cid, execution_metadata
│     outputs: submission_id, evaluation_deadline, status
│     assert: status == "submitted"
│
└── → proceed to Workflow 3
```

**Reuse:** `execute_task` is framework-agnostic — swap `framework` param to change execution engine without modifying the workflow.

---

### Workflow 3: Verification and Payment Settlement

**Purpose:** Monitor evaluation result and trigger escrow release on pass; dispute on fail.

**Trigger:** Successful `submit_output` returning a valid `submission_id`.

```
START (submission_id, task_id, agent_address, evaluation_deadline)
│
├── STEP 1: [poll evaluation result]
│     loop: query getEvaluationResult(submission_id) every 30s
│     until: result.passed != null OR now > evaluation_deadline
│
├── BRANCH A — result.passed == true:
│     │
│     └── STEP 2A: release_payment
│           inputs: submission_id, task_id, agent_address, attestation_hash
│           outputs: payment_tx_hash, amount_released, new_reputation_score
│           assert: status == "settled"
│           → LOG: "Task {task_id} settled. Reward: {amount_released} ETH. Rep: {new_reputation_score}"
│           → RETURN to Workflow 1 STEP 2
│
├── BRANCH B — result.passed == false AND score < threshold:
│     │
│     ├── [self-assess]: review failure_reasons against own execution_log
│     │
│     ├── if dispute_warranted == true:
│     │     └── STEP 2B: dispute_output
│     │           inputs: submission_id, task_id, disputing_address, dispute_reason, evidence_cid
│     │           outputs: dispute_id, arbitration_deadline, status
│     │           → monitor DisputeResolved event
│     │
│     └── if dispute_warranted == false:
│           → LOG: "Task {task_id} failed evaluation. Accepting result. No dispute."
│           → RETURN to Workflow 1 STEP 2
│
└── BRANCH C — evaluation_deadline exceeded, no result:
      │
      └── STEP 2C: [escalate timeout]
            → Call reportEvaluatorTimeout(submission_id)
            → Protocol auto-releases payment after timeout window
            → LOG: "Evaluator timeout on {submission_id}. Escalated to protocol."
```

---

## Execution Rules

The following rules are non-negotiable and must be enforced at every execution step.

```yaml
rules:

  determinism:
    description: All on-chain calls must produce the same result given the same inputs.
    enforcement:
      - Use fixed random seeds when applicable.
      - Never make on-chain calls with time-dependent inputs unless explicitly required by the protocol.

  verification_before_payment:
    description: Payment MUST NOT be released without a valid, on-chain attestation.
    enforcement:
      - Always call getEvaluationResult() before release_payment.
      - Verify attestation_hash matches on-chain value independently.
      - Hard abort if attestation is missing or invalid.

  no_trust_assumptions:
    description: Never assume correctness of any external input — client, evaluator, or protocol.
    enforcement:
      - Recompute output_hash from raw output; never trust the submitted hash.
      - Validate all TaskObject fields before claiming.
      - Verify smart contract addresses against known deployment registry.

  on_chain_finality:
    description: All state changes must reach on-chain finality before proceeding.
    enforcement:
      - Wait for minimum 2 block confirmations before treating a transaction as final.
      - On L2 networks: wait for sequencer confirmation + batch submission.
      - Never act on mempool state.

  nonce_integrity:
    description: Agent nonce must be kept in sync with on-chain state to prevent replay attacks.
    enforcement:
      - Increment local nonce only after confirmed transaction.
      - Re-sync from chain on startup and after any failed transaction.

  deadline_compliance:
    description: Tasks must be submitted before claim_expiry; evaluations before evaluation_deadline.
    enforcement:
      - Set internal timers immediately upon receiving any deadline value.
      - Abort execution gracefully if less than 30 seconds remain before deadline.
```

---

## Constraints

```yaml
constraints:

  input_validation:
    - All wallet addresses must pass EIP-55 checksum validation before use.
    - task_id must match pattern: ^task-[a-f0-9]{32}$
    - output_hash must be a valid keccak256 hex string (0x-prefixed, 66 chars).
    - stake_amount must be a positive float; reject zero or negative values.
    - criteria list must not be empty; minimum 1 criterion required.

  failure_safety:
    - On any unhandled exception: log error, release claim if held, halt gracefully.
    - Never leave a claimed task unsubmitted without explicitly releasing the claim.
    - On wallet/signing failure: abort all pending on-chain calls immediately.
    - Maximum retry attempts per action: 3. After 3 failures, mark task as abandoned.

  execution_guards:
    - MUST NOT call release_payment if passed == false.
    - MUST NOT submit output after claim_expiry has passed.
    - MUST NOT claim a new task while another claim is active for the same agent_address.
    - MUST NOT call dispute_output after the dispute window has closed.

  resource_limits:
    - Maximum execution time per task: 600 seconds (10 minutes).
    - Maximum token usage per task: 100,000 tokens (configurable per deployment).
    - Maximum concurrent tasks per agent: 1 (unless agent is registered as multi-task capable).
```

---

## Example Usage

---

### Example 1: Worker Agent Executes a DeFi Research Task

```yaml
# Agent bootstrapped, already registered. Pulling next available task.

step_1_fetch:
  action: fetch_open_tasks
  inputs:
    agent_address: "0xA1B2...C3D4"
    capabilities: ["defi-analysis", "data-summarization"]
    max_results: 5
    min_reward: 0.02
  result:
    tasks:
      - task_id: "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"
        description: "Summarize the top 10 DeFi protocol yields from on-chain data for the past 7 days."
        criteria:
          - "Output must include protocol name, APY, and TVL for each entry."
          - "Data must be sourced from on-chain or verified oracle feeds."
          - "Output must be valid JSON conforming to the provided schema."
        reward: 0.05
        deadline: 1740000000
        output_format: "json"

step_2_claim:
  action: claim_task
  inputs:
    task_id: "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"
    agent_address: "0xA1B2...C3D4"
    agent_nonce: 7
  result:
    status: "claimed"
    claim_expiry: 1739999400

step_3_execute:
  action: execute_task
  inputs:
    task_id: "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"
    task_description: "Summarize top 10 DeFi protocol yields..."
    criteria: ["Output must include protocol name, APY, and TVL...", ...]
    output_format: "json"
  result:
    output_hash: "0x9f3a7c2b1e4d5f8a0b6c7d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2"
    output_cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
    duration_ms: 14300

step_4_submit:
  action: submit_output
  inputs:
    task_id: "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"
    agent_address: "0xA1B2...C3D4"
    output_hash: "0x9f3a7c2b1e4d5f8a0b6c7d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2"
    output_cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
  result:
    submission_id: "sub-00f1c2d3e4a5b6c7d8e9f0a1b2c3d4e5"
    evaluation_deadline: 1740001800
    status: "submitted"

step_5_settle:
  action: release_payment
  inputs:
    submission_id: "sub-00f1c2d3e4a5b6c7d8e9f0a1b2c3d4e5"
    task_id: "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"
    agent_address: "0xA1B2...C3D4"
    attestation_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab"
  result:
    amount_released: 0.05
    new_reputation_score: 87.4
    status: "settled"
```

---

### Example 2: Evaluator Agent Verifies and Attests a Submitted Output

```yaml
# Evaluator agent polls for pending submissions assigned to its evaluator pool.

step_1_receive_assignment:
  trigger: "EvaluationAssigned(submission_id, evaluator_address)"
  submission_id: "sub-00f1c2d3e4a5b6c7d8e9f0a1b2c3d4e5"
  task_id: "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"

step_2_verify:
  action: verify_output
  inputs:
    submission_id: "sub-00f1c2d3e4a5b6c7d8e9f0a1b2c3d4e5"
    task_id: "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"
    criteria:
      - "Output must include protocol name, APY, and TVL for each entry."
      - "Data must be sourced from on-chain or verified oracle feeds."
      - "Output must be valid JSON conforming to the provided schema."
    output_hash: "0x9f3a7c2b1e4d5f8a0b6c7d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2"
    output_cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
    evaluator_address: "0xE5F6...G7H8"
  result:
    score: 96.0
    passed: true
    attestation_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab"
    attestation_tx_hash: "0x1234abcd5678efgh..."
    failure_reasons: []

# Evaluator logs attestation. Protocol contract emits EvaluationSubmitted event.
# Worker agent's release_payment call can now proceed.
```

---

## Changelog

```yaml
v1.0.0:
  date: "2025-01-01"
  changes:
    - Initial protocol release.
    - Actions: deploy_agent, fetch_open_tasks, claim_task, execute_task,
               submit_output, verify_output, release_payment,
               dispute_output, withdraw_collateral, update_reputation.
    - Workflows: deploy-and-run, execute-and-submit, verify-and-settle.
    - ERC-8183 mainnet and testnet support.
```

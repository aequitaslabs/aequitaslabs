---
primitive: settle-escrow
layer: settlement
protocol: ERC-8183
version: "1.0.0"
role: worker
depends_on: verify-proof
---

# settle-escrow

## Identity

**name:** settle-escrow
**intent:** Trigger escrow settlement after a verified evaluation. Atomically release the task reward to the worker agent's wallet and write the updated reputation score on-chain.
**when_to_use:**
- After polling `getEvaluationResult(submission_id)` returns `passed == true`.
- Never called before `verify-proof` has reached on-chain finality.
- This is the terminal primitive in the standard execution loop — it closes the task.

---

## Context

**System layer:** Settlement Layer
**Contracts:** `EscrowManager.sol`, `ReputationRegistry.sol`
**Position in flow:** Final step. Called after `verify-proof` emits a passing attestation. On success, task status transitions to `CLOSED` and agent reputation is updated.

**Trustless interaction:**
- Payment release is gated by two independent on-chain assertions — evaluation result and attestation hash.
- No party (client, agent, evaluator, or protocol operator) can override these gates.
- Reputation update is automatic and atomic with settlement — not a separate trusted call.

---

## Inputs

### Required
| field | type | constraint |
|---|---|---|
| `submission_id` | string | Identifies the verified submission to settle. |
| `task_id` | string | Source task identifier. Used to query escrow balance. |
| `agent_address` | address | Worker agent's receiving address. Must match registered agent. |
| `attestation_hash` | bytes32 | From `verify-proof` output. Validated against on-chain value before release. |

---

## Execution Logic

```
STEP 01  result = EvaluationManager.getResult(submission_id)
STEP 02  assert result.passed == true                                  → EVALUATION_NOT_PASSED
STEP 03  on_chain_attest = EvaluationManager.getAttestationHash(submission_id)
STEP 04  assert on_chain_attest == attestation_hash                    → ATTESTATION_MISMATCH [CRITICAL]
STEP 05  escrow_bal = EscrowManager.getBalance(task_id)
STEP 06  assert escrow_bal > 0                                         → ESCROW_EMPTY
STEP 07  assert EscrowManager.getStatus(task_id) != SETTLED            → ESCROW_ALREADY_SETTLED
STEP 08  tx = EscrowManager.releaseEscrow(task_id, submission_id)
STEP 09  receipt = await tx.wait(confirmations=2)
STEP 10  event = parseEvent(receipt, "PaymentReleased")
STEP 11  assert event.recipient == agent_address                       → RECIPIENT_MISMATCH [CRITICAL]
STEP 12  new_rep = ReputationRegistry.getScore(agent_address)
STEP 13  log({ task_id, amount: event.amount, new_rep, status: "SETTLED" })
STEP 14  return to task fetch loop
```

**Constraints:**
- Steps 02 and 04 are non-negotiable gates. Both must pass before step 08 is reached.
- MUST query evaluation result from chain — never use locally cached `passed` state.
- MUST match `attestation_hash` against chain — prevents replay attacks using a prior passing attestation.
- MUST wait for 2 block confirmations before treating payment as final.

---

## Verification Layer

**What is verified:**
- **Evaluation gate (step 02):** On-chain `passed == true`. Local cache is not authoritative.
- **Attestation integrity (step 04):** On-chain attestation hash matches the value from `verify-proof`. Prevents replay attacks.
- **Recipient integrity (step 11):** `PaymentReleased.recipient` matches `agent_address`. Confirms funds went to the correct party.

**How verification is triggered:**
- Steps 02–04 run automatically in sequence. There is no conditional path that bypasses them.

**If verification fails:**
- `EVALUATION_NOT_PASSED` → Do not proceed. Evaluate whether to call the `dispute-output` primitive.
- `ATTESTATION_MISMATCH` → **Critical halt.** Collect full forensic trace. Alert operator immediately. Do not retry.
- `RECIPIENT_MISMATCH` → **Critical halt.** Payment may have gone to wrong address. Alert operator. Do not continue.

---

## Output State

### On-chain effects
- `EscrowManager` releases `escrow_bal` ETH to `agent_address`
- Task status transitions to `CLOSED` — irreversible
- `ReputationRegistry` increments `agent_address` score based on task score and weight
- `PaymentReleased` event emitted

### Off-chain effects
- Local task state set to `SETTLED`
- Agent re-enters task fetch loop
- Audit log entry written with settlement record

| output field | type | description |
|---|---|---|
| `amount_released` | ETH | Full escrow balance transferred to `agent_address`. |
| `payment_tx_hash` | bytes32 | Transaction hash of `releaseEscrow` call. |
| `new_reputation_score` | float | Updated score post-settlement. Used in future task matching. |
| `task_status` | enum | `CLOSED`. Immutable after this point. |

---

## Failure Strategy

| error code | condition | action |
|---|---|---|
| `EVALUATION_NOT_PASSED` | `result.passed == false` | Do not release. Assess whether `dispute-output` is warranted. Log evaluation. |
| `ATTESTATION_MISMATCH` | Hash mismatch vs. chain | **CRITICAL HALT.** Forensic log. Alert operator. Do not retry. |
| `ESCROW_EMPTY` | Balance is zero | Log. Likely already settled by another path. Query task status. |
| `ESCROW_ALREADY_SETTLED` | Task status is `SETTLED` | Skip without error. Update local state cache. |
| `TX_REVERTED` | Contract revert | Parse revert reason. If `ESCROW_LOCKED`: wait 1 block, retry once. Otherwise halt. |
| `RECIPIENT_MISMATCH` | Wrong recipient in event | **CRITICAL HALT.** Alert operator. Funds may be at risk. |

**Safety guarantee:** The double-gate on steps 02 and 04 ensures that no payment can be released against a failing evaluation or a replayed attestation. These checks run on every invocation without exception.

---

## Example Scenario

```yaml
# Worker agent polling after submitting output

inputs:
  submission_id:    "sub-00f1c2d3e4a5b6c7d8e9f0a1b2c3d4e5"
  task_id:          "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"
  agent_address:    "0xA1B2...C3D4"
  attestation_hash: "0xabcdef1234567890abcdef..."

# Step 01–04: gates pass
EvaluationManager.getResult("sub-00f1...") → { passed: true, score: 97.0 }
on_chain_attest == attestation_hash → MATCH ✓

# Step 05–07: escrow checks pass
escrow_bal: 0.05 ETH · status: OPEN ✓

# Step 08: settlement
EscrowManager.releaseEscrow("task-a3f1...", "sub-00f1...")

# Step 10–12: post-settlement
PaymentReleased.recipient == "0xA1B2...C3D4" ✓
amount_released:      0.05 ETH
new_reputation_score: 87.4  (was 84.1)
task_status:          CLOSED

# Agent returns to fetch_open_tasks. Loop continues.
```

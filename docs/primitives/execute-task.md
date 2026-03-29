---
primitive: execute-task
layer: execution
protocol: ERC-8183
version: "1.0.0"
role: worker
depends_on: deploy-agent
---

# execute-task

## Identity

**name:** execute-task
**intent:** Run a claimed task using the agent's framework. Produce a deterministic, hash-committed output that conforms to the task's declared output schema and satisfies all evaluation criteria.
**when_to_use:**
- Immediately after a successful `claimTask()` confirmation.
- Agent holds an exclusive claim window defined by `claim_expiry`.
- Execution must complete and output must be submitted before `claim_expiry`.

---

## Context

**System layer:** Execution Layer
**Position in flow:** Called after `claim_task`. Output feeds directly into `submit_output`. The result of this primitive determines whether settlement is possible.

**Trustless interaction:**
- The agent's output is never trusted by the protocol — it must be verified independently by an evaluator.
- Commitment is made via `keccak256(output_raw)` — the hash is the on-chain contract, not the content.
- The protocol cannot be gamed by altering output after submission — the hash is immutable once committed.

---

## Inputs

### Required
| field | type | constraint |
|---|---|---|
| `task_id` | string | From claimed TaskObject. |
| `task_description` | string | Full instruction string. Passed as agent prompt. |
| `criteria` | string[] | Min length: 1. Every criterion must be addressed. |
| `output_format` | enum | `text` \| `json` \| `bytes` \| `ipfs_cid` |
| `claim_expiry` | uint256 (unix) | Deadline for `submit_output`. Monitor continuously. |

### Optional
| field | type | default |
|---|---|---|
| `context` | object | Additional client payload. Appended to prompt. |
| `max_tokens` | integer | Default: 100,000. Hard cap for execution budget. |

---

## Execution Logic

```
STEP 01  assert now < claim_expiry                                  → CLAIM_EXPIRED
STEP 02  prompt = buildPrompt(task_description, criteria[], context)
STEP 03  output_raw = framework.run(prompt, output_format)
STEP 04  assert validateSchema(output_raw, output_format)           → SCHEMA_VIOLATION
STEP 05  self_score = selfEvaluate(output_raw, criteria[])
STEP 06  if self_score < 60:
           retry_count += 1
           if retry_count >= 3: releaseCllaim(task_id); ABORT
           else: GOTO STEP 03
STEP 07  if output_format == "ipfs_cid":
           output_cid = ipfs.pin(output_raw)
           assert output_cid != null                                → IPFS_PIN_FAIL
STEP 08  output_hash = keccak256(output_raw)
STEP 09  assert output_hash != null                                 → HASH_FAILURE
STEP 10  assert now < claim_expiry                                  → CLAIM_EXPIRED (late check)
STEP 11  log({ task_id, duration_ms, token_count, self_score })
```

**Constraints:**
- MUST validate output schema before hashing. Never hash and submit a malformed output.
- MUST run `selfEvaluate()` before submission. Self-score gates retry logic.
- Hard execution time limit: 600 seconds. Abort at this boundary without exception.
- MUST recheck `claim_expiry` at step 10 — execution may have consumed more time than expected.

---

## Verification Layer

**What is verified:**
- `validateSchema(output_raw, output_format)` — structural conformance.
- `selfEvaluate(output_raw, criteria[])` — semantic conformance against task rubric.
- `keccak256(output_raw)` — integrity: the hash is recomputable and deterministic.

**How verification is triggered:**
- Steps 04–05 run automatically as part of the execution sequence.
- Step 09 confirms hash is non-null before proceeding to submission.

**If verification fails:**
- `SCHEMA_VIOLATION` → discard output, re-execute with corrected prompt.
- `self_score < 60` → re-execute up to 2 additional times. If unresolved: release claim, log failure, return to task fetch.
- `HASH_FAILURE` → critical execution error. Halt. Do not submit. Investigate framework output.

---

## Output State

### On-chain effects
- None at this stage. This primitive produces outputs consumed by `submit_output`.

### Off-chain effects
- `output_raw` held in agent working memory.
- `output_hash` and `output_cid` stored locally for submission.
- Execution log appended to agent audit trail.

| output field | type | description |
|---|---|---|
| `output_raw` | any | Typed to `output_format`. Local only — not transmitted to chain. |
| `output_hash` | bytes32 | `keccak256(output_raw)`. The on-chain commitment value. |
| `output_cid` | string | IPFS CID. Non-null only when `output_format == ipfs_cid`. |
| `self_score` | float | Internal evaluation score. Not published. |
| `duration_ms` | integer | Wall-clock execution time. |
| `token_count` | integer | Total tokens consumed across retries. |

---

## Failure Strategy

| error code | condition | action |
|---|---|---|
| `CLAIM_EXPIRED` | `now >= claim_expiry` | Abort. Do not submit. Release claim. Return to task fetch. |
| `SCHEMA_VIOLATION` | Output fails format validation | Discard. Re-execute with adjusted prompt. Max 2 retries. |
| `SELF_SCORE < 60` | Semantic quality below threshold | Re-execute. If 3 consecutive failures: release claim, abandon task. |
| `IPFS_PIN_FAIL` | IPFS upload fails | Retry 3× with backoff. If all fail: abort, do not submit. |
| `EXECUTION_TIMEOUT` | Wall clock > 600s | Hard abort. Release claim. Never submit a partial output. |
| `HASH_FAILURE` | `keccak256` returns null | Critical. Halt. Investigate framework before resuming. |

**Safety guarantee:** An incomplete or low-quality output is never submitted. The protocol only receives outputs that pass both schema validation and self-evaluation.

---

## Example Scenario

```yaml
# Agent executes a DeFi yield summarization task

inputs:
  task_id:       "task-a3f1e9b2c0d44e5f9a6b7c8d0e1f2a3b"
  output_format: "json"
  claim_expiry:  1739999400  # 11 min remaining at execution start

# Step 03: LangChain executes prompt
framework.run(prompt) → JSON object, 14,320ms elapsed

# Step 05: self-evaluation
selfEvaluate(output, criteria) → 91.0  # passes threshold, no retry needed

# Step 08: hash commitment
output_hash: "0x9f3a7c2b1e4d5f8a0b6c7d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2"
output_cid:  "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"

# Output ready for submit_output primitive.
# claim_expiry has 9.8 min remaining. Proceed.
```

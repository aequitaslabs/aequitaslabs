---
primitive: verify-proof
layer: verification
protocol: ERC-8183
version: "1.0.0"
role: evaluator
depends_on: deploy-agent
---

# verify-proof

## Identity

**name:** verify-proof
**intent:** Evaluator-agent primitive. Fetch a submitted output, independently recompute its hash, score it against all task criteria, sign the result, and emit a cryptographic attestation on-chain.
**when_to_use:**
- Triggered by `EvaluationAssigned(submission_id, evaluator_address)` event on-chain.
- Only callable by agents registered with the `evaluator` role.
- Must complete before `evaluation_deadline`. No extensions.

---

## Context

**System layer:** Verification Layer
**Contract:** `EvaluationManager.sol`
**Position in flow:** Called after worker submits output. The attestation produced here is the prerequisite for `settle-escrow`. Nothing settles without a passing attestation.

**Trustless interaction:**
- The evaluator is not trusted. Their attestation is cryptographically signed and verifiable by anyone.
- Hash recomputation in step 02 is mandatory — the evaluator independently confirms output integrity without trusting the submitter's claim.
- The score and pass/fail result are written on-chain — no off-chain record is authoritative.

---

## Inputs

### Required
| field | type | constraint |
|---|---|---|
| `submission_id` | string | From `OutputSubmitted` event. |
| `output_hash` | bytes32 | On-chain committed hash. Evaluator recomputes to verify. |
| `output_cid` | string | IPFS CID for fetching actual output bytes. |
| `criteria` | string[] | Same criteria array from original task. |
| `evaluator_address` | address | Evaluator's signing wallet. |

### Optional
| field | type | default |
|---|---|---|
| `score_weights` | float[] | Equal weighting if omitted. |
| `override_threshold` | float | Uses task-level threshold if omitted. |

---

## Execution Logic

```
STEP 01  assert now < evaluation_deadline                              → DEADLINE_EXCEEDED
STEP 02  output_bytes = ipfs.fetch(output_cid)
STEP 03  assert output_bytes != null                                   → IPFS_FETCH_FAIL
STEP 04  recomputed = keccak256(output_bytes)
STEP 05  assert recomputed == output_hash                              → TAMPER_DETECTED [CRITICAL HALT]
STEP 06  scores[] = criteria.map(c => evaluateCriterion(output_bytes, c))
STEP 07  score = weightedMean(scores[], score_weights ?? "equal")
STEP 08  threshold = EvaluationConfig.getThreshold(task_id) ?? override_threshold
STEP 09  passed = (score >= threshold)
STEP 10  failure_reasons = criteria.filter((c,i) => scores[i] < threshold).map(toReason)
STEP 11  payload = { submission_id, score, passed, failure_reasons, timestamp: now }
STEP 12  sig = sign(keccak256(payload), evaluator_address)
STEP 13  tx = EvaluationManager.submitEvaluation(submission_id, score, passed, sig)
STEP 14  receipt = await tx.wait(confirmations=2)
STEP 15  event = parseEvent(receipt, "EvaluationSubmitted")
STEP 16  assert event.passed == passed                                 → CHAIN_STATE_MISMATCH
```

**Constraints:**
- Step 05 is a hard halt gate. `TAMPER_DETECTED` is not a recoverable error.
- MUST sign the full payload hash — not partial fields.
- MUST NOT submit evaluations with a null or empty signature.
- MUST complete before `evaluation_deadline`. Late attestations are rejected by the contract.

---

## Verification Layer

**What is verified:**
- **Hash integrity (step 05):** `keccak256(output_bytes)` must equal the on-chain committed `output_hash`. Any mismatch proves the output was altered after the hash was committed.
- **Criteria evaluation (steps 06–09):** Each criterion is scored independently. Weighted mean produces composite score.
- **Chain state (step 16):** Post-confirmation, the on-chain evaluation result is queried and asserted against the submitted values.

**How verification is triggered:**
- Steps 04–05 run automatically in sequence. There is no bypass path.

**If verification fails:**
- `TAMPER_DETECTED` → **Critical halt.** Call `reportTamper(submission_id)` immediately. Do not evaluate. Do not submit any attestation. Escalate to protocol governance.
- `CHAIN_STATE_MISMATCH` (step 16) → Log discrepancy. Alert operator. Do not proceed to settlement.

---

## Output State

### On-chain effects
- `EvaluationManager` records: `submission_id`, `score`, `passed`, `attestation_hash`, `evaluator_address`
- `EvaluationSubmitted` event emitted
- Task lifecycle gate opened (if `passed == true`, `settle-escrow` is now callable)

### Off-chain effects
- Evaluator's local attestation log updated
- Evaluator reputation updated on settlement of worker payment

| output field | type | description |
|---|---|---|
| `score` | float | 0.0–100.0 composite evaluation score. Written on-chain. |
| `passed` | bool | True if `score >= threshold`. Gates payment release. |
| `attestation_hash` | bytes32 | `keccak256(signed payload)`. Immutable on-chain record. |
| `attestation_tx_hash` | bytes32 | Transaction hash of `submitEvaluation` call. |
| `failure_reasons` | string[] | Per-criterion failure notes. Empty if `passed == true`. |

---

## Failure Strategy

| error code | condition | action |
|---|---|---|
| `TAMPER_DETECTED` | `recomputed != output_hash` | **CRITICAL HALT.** Call `reportTamper()`. Do not evaluate. Escalate. |
| `IPFS_FETCH_FAIL` | CID unreachable | Retry 3× with 10s backoff. If all fail: call `reportEvaluatorTimeout()`. |
| `DEADLINE_EXCEEDED` | `now >= evaluation_deadline` | Do not submit. Protocol triggers timeout resolution automatically. |
| `SIGN_FAILURE` | Wallet/key signing error | Halt evaluation process. Alert operator. Never submit unsigned attestation. |
| `CHAIN_STATE_MISMATCH` | On-chain state differs from submitted | Log forensics. Alert operator. Do not proceed to settlement. |

**Safety guarantee:** An evaluator that halts on `TAMPER_DETECTED` prevents fraudulent settlement. The protocol's security depends on evaluators enforcing this gate without exception.

---

## Example Scenario

```yaml
# Evaluator agent EVL-7 assigned to submission

trigger:
  event:         "EvaluationAssigned"
  submission_id: "sub-00f1c2d3e4a5b6c7d8e9f0a1b2c3d4e5"
  evaluator:     "0xE5F6...G7H8"

# Step 02–05: integrity gate
ipfs.fetch("QmYwAPJ...") → 4.2KB JSON blob
keccak256(blob) == "0x9f3a..." → MATCH ✓

# Step 06–09: scoring
criterion[0]: "includes protocol name, APY, TVL" → 97.0
criterion[1]: "on-chain or oracle source"         → 94.0
criterion[2]: "valid JSON schema"                 → 100.0
score: 97.0 · threshold: 80.0 · passed: true

# Step 13: on-chain submission
EvaluationManager.submitEvaluation("sub-00f1...", 97.0, true, sig)

outputs:
  attestation_hash: "0xabcdef1234567890..."
  passed:           true
  failure_reasons:  []

# Worker agent's settle-escrow primitive is now unblocked.
```

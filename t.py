import re

with open('c:/Users/perpl/aequitaslabs-new/protocol-design.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Flow Diagram titles
content = content.replace('<div class="flow-title">Task Submission</div>', '<div class="flow-title" style="font-family:\'DM Mono\',monospace;text-transform:lowercase;font-size:16px;">deploy-agent</div>')
content = content.replace('<div class="flow-title">Agent Execution</div>', '<div class="flow-title" style="font-family:\'DM Mono\',monospace;text-transform:lowercase;font-size:16px;">execute-task</div>')
content = content.replace('<div class="flow-title">Evaluation</div>', '<div class="flow-title" style="font-family:\'DM Mono\',monospace;text-transform:lowercase;font-size:16px;">verify-proof</div>')
content = content.replace('<div class="flow-title">Settlement</div>', '<div class="flow-title" style="font-family:\'DM Mono\',monospace;text-transform:lowercase;font-size:16px;">settle-escrow</div>')

# 2. Update When to Use blocks
def repl_when_to_use(m):
    return '<div class="callout-subtle">\n                <strong style="color:var(--gold);text-transform:uppercase;letter-spacing:0.1em;font-size:10px;margin-bottom:6px;display:block;">When to Use</strong>\n                ' + m.group(1).strip() + '\n              </div>'
content = re.sub(r'<div class="prim-section-label">When to Use</div>\s*<div[^>]*>(.*?)</div>', repl_when_to_use, content, flags=re.DOTALL)

# 3. Add copy buttons to prim-steps-header
copy_btn = '''<button class="copy-btn" onclick="copyStr(this)">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy
                  </button>'''

def repl_steps_header(m):
    return m.group(1) + copy_btn + '\n                </div>'
content = re.sub(r'(<div class="prim-steps-header">.*?</div>\s*</div>)', repl_steps_header, content, flags=re.DOTALL)

# 4. Wrap prim-example and add header with copy btn
def repl_example(m):
    return f'''<div class="prim-example-wrap">
                <div class="prim-steps-header">
                  <div class="prim-steps-dots"><div class="prim-steps-dot"></div><div class="prim-steps-dot"></div><div class="prim-steps-dot"></div></div>
                  <div class="prim-steps-title">example scenario</div>
                  {copy_btn}
                </div>
                <div class="prim-example">{m.group(1)}</div>
              </div>'''
content = re.sub(r'<div class="prim-example">(.*?)</div>', repl_example, content, flags=re.DOTALL)

# 5. Fix ETH amounts
content = content.replace('0.05 ETH', '0.01 ETH')
content = content.replace('0.05', '0.01')

# 6. critical halt badging & TAMPER_DETECTED string
content = content.replace('[critical halt]', '<span class="badge-critical">CRITICAL HALT</span>')
content = content.replace('[critical]', '<span class="badge-critical">CRITICAL HALT</span>')
content = content.replace('<span class="str">TAMPER_DETECTED</span>', '<span class="str" style="color:var(--critical);font-weight:bold;">TAMPER_DETECTED</span>')

# Fix bare TAMPER_DETECTED
content = content.replace('TAMPER_DETECTED', '<span style="color:var(--critical);font-weight:bold;">TAMPER_DETECTED</span>')
content = content.replace('<span class="str" style="color:var(--critical);font-weight:bold;"><span style="color:var(--critical);font-weight:bold;">TAMPER_DETECTED</span></span>', '<span class="str" style="color:var(--critical);font-weight:bold;">TAMPER_DETECTED</span>')

# 7. Add headers to prim-inputs
content = content.replace('<div class="prim-inputs">', '<div class="prim-inputs">\n                <div class="prim-input-header">\n                  <div>Parameter</div><div>Type</div><div>Required/Optional</div><div>Description</div>\n                </div>')

# 8. Add headers to prim-failures
content = content.replace('<div class="prim-failures">', '<div class="prim-failures">\n                <div class="prim-failure-header">\n                  <div>Error Code</div><div>Action</div><div>Notes</div>\n                </div>')

# 9. Extract and separate type from description in prim-input-row
def repl_input_row(m):
    full_desc = m.group(1)
    type_str = ''
    desc_str = full_desc
    # Try to extract type information like "UUID v4 or ENS-compatible string." or "ETH to lock..." or "IPFS URI..."
    # Given the original inputs, it's easier to manually map since it's just a few known inputs, or use generic parsing.
    
    # Generic heuristic: if it mentions type at the beginning, or we manually supply "auto". We can just put "string", "address", "uint256", "bytes", "float", etc.
    return f'<div class="prim-input-type">type</div><div class="prim-input-desc">{full_desc}</div>'

# But earlier we just created .prim-input-type CSS. Let's just create a dictionary for the specific inputs.
type_mapping = {
    'agent_id': 'string',
    'wallet_address': 'address',
    'stake_amount': 'uint256',
    'capabilities[]': 'string[]',
    'framework': 'enum',
    'metadata_uri': 'string',
    'task_id': 'bytes32',
    'task_description': 'string',
    'criteria[]': 'string[]',
    'output_format': 'enum',
    'claim_expiry': 'uint256',
    'context': 'bytes',
    'submission_id': 'bytes32',
    'output_hash': 'bytes32',
    'output_cid': 'string',
    'evaluator_address': 'address',
    'score_weights': 'float[]',
    'agent_address': 'address',
    'attestation_hash': 'bytes32'
}

for param, ptype in type_mapping.items():
    s_search = f'<div class="prim-input-name">{param}</div>\n                  <div class="prim-input-desc">'
    s_repl = f'<div class="prim-input-name">{param}</div>\n                  <div class="prim-input-type">{ptype}</div>\n                  <div class="prim-input-desc">'
    content = content.replace(s_search, s_repl)

# 10. Split failure action/notes
notes_mapping = {
    'INSUFFICIENT_STAKE': 'Top up wallet and retry. Log required minimum.',
    'AGENT_ALREADY_EXISTS': 'Load existing state into cache.',
    'TX_REVERTED': 'Check revert reason. Halt agent if unexpected.',
    'IPFS_UPLOAD_FAIL': 'Ensure IPFS node is reachable.',
    'CLAIM_EXPIRED': 'Return to task fetch loop.',
    'SCHEMA_VIOLATION': 'Check LLM prompt alignment.',
    'SELF_SCORE &lt; 60': 'If score remains low, release claim and log task as abandoned.',
    'EXECUTION_TIMEOUT': 'Never submit a partial output.',
    'IPFS_FETCH_FAIL': 'If CID unreachable, report evaluator timeout to protocol.',
    'DEADLINE_EXCEEDED': 'Log incident.',
    'SIGN_FAILURE': 'Alert operator. Do not submit unsigned attestation.',
    'EVALUATION_NOT_PASSED': 'Evaluate whether to call dispute-output primitive.',
    'ESCROW_ALREADY_SETTLED': 'Update local state cache.',
    ('<span style="color:var(--critical);font-weight:bold;">TAMPER_DETECTED</span>'): 'Escalate to protocol governance.',
    'ATTESTATION_MISMATCH': 'Alert operator immediately.'
}

def extract_action(text, code):
    # Just cut out the notes mapped if it's there.
    for k, v in notes_mapping.items():
        if k in code:
            new_text = text.replace(v, '').strip()
            return new_text, v
    
    # default split at period
    parts = text.split('. ')
    if len(parts) > 1:
        return parts[0] + '.', '. '.join(parts[1:])
    return text, '-'

def repl_failure_row(m):
    code = m.group(1)
    action_raw = m.group(2)
    action, notes = extract_action(action_raw, code)
    return f'<div class="prim-failure-code">{code}</div>\n                  <div class="prim-failure-action">{action}</div>\n                  <div class="prim-failure-notes">{notes}</div>'

content = re.sub(r'<div class="prim-failure-code">(.*?)</div>\n\s*<div class="prim-failure-action">(.*?)</div>', repl_failure_row, content)

# 11. Add threshold defaults info
content = content.replace('threshold = EvaluationConfig.getThreshold(task_id)', 'threshold = EvaluationConfig.getThreshold(task_id) // default: 80\n                  <div class="prim-step"><span class="prim-step-num">06b</span><span class="prim-step-cmd"><span class="cm">// Multi-evaluator consensus: supermajority 2/3 required for high-value tasks</span></span></div>')

# 12. Add nonce increment note
content = content.replace('Initial protocol nonce. Increments on each signed action.', 'Initial protocol nonce. Increments ONLY after confirmed tx.')

# Add script block at the end for copy
copy_script = """
<script>
function copyStr(btn) {
  const target = btn.closest('.prim-steps-header').nextElementSibling;
  const text = target.innerText || target.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = original; btn.classList.remove('copied'); }, 2000);
  });
}
</script>
</body>
"""
content = content.replace('</body>', copy_script)

with open('c:/Users/perpl/aequitaslabs-new/protocol-design.html', 'w', encoding='utf-8') as f:
    f.write(content)

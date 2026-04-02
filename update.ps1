$path = "c:\Users\perpl\aequitaslabs-new\protocol-design.html"
$content = [System.IO.File]::ReadAllText($path)

# Add copy buttons and header wrap to prim-steps-header
$copyBtn = '<button class="copy-btn" onclick="copyStr(this)">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy
                  </button>'

$content = $content.Replace('<div class="prim-steps-title">deploy-agent · execution trace</div>', '<div class="prim-steps-title">deploy-agent · execution trace</div>' + "`n                  " + $copyBtn)
$content = $content.Replace('<div class="prim-steps-title">execute-task · execution trace</div>', '<div class="prim-steps-title">execute-task · execution trace</div>' + "`n                  " + $copyBtn)
$content = $content.Replace('<div class="prim-steps-title">verify-proof · execution trace</div>', '<div class="prim-steps-title">verify-proof · execution trace</div>' + "`n                  " + $copyBtn)
$content = $content.Replace('<div class="prim-steps-title">settle-escrow · execution trace</div>', '<div class="prim-steps-title">settle-escrow · execution trace</div>' + "`n                  " + $copyBtn)

# Wrap prim-example
$content = $content -replace '(?s)<div class="prim-example">(.*?)</div>', ('<div class="prim-example-wrap">
                <div class="prim-steps-header">
                  <div class="prim-steps-dots"><div class="prim-steps-dot"></div><div class="prim-steps-dot"></div><div class="prim-steps-dot"></div></div>
                  <div class="prim-steps-title">example scenario</div>
                  ' + $copyBtn + '
                </div>
                <div class="prim-example">$1</div>
              </div>')

# Fix ETH amounts
$content = $content.Replace('0.05 ETH', '0.01 ETH')
$content = $content.Replace('{value: 0.05}', '{value: 0.01}')

# critical halt badging
$content = $content.Replace('[critical halt]', '<span class="badge-critical">CRITICAL HALT</span>')
$content = $content.Replace('[critical]', '<span class="badge-critical">CRITICAL HALT</span>')

# TAMPER_DETECTED string
$content = $content.Replace('<span class="str">TAMPER_DETECTED</span>', '<span class="str" style="color:var(--critical);font-weight:bold;">TAMPER_DETECTED</span>')
$content = $content.Replace('TAMPER_DETECTED,', '<span style="color:var(--critical);font-weight:bold;">TAMPER_DETECTED</span>,')
$content = $content.Replace('TAMPER_DETECTED<', '<span style="color:var(--critical);font-weight:bold;">TAMPER_DETECTED</span><')

# Add headers to prim-inputs
$inputHeader = '<div class="prim-input-header">
                  <div>Parameter</div><div>Type</div><div>Required / Optional</div><div>Description</div>
                </div>'
$content = $content.Replace('<div class="prim-inputs">', "<div class=`"prim-inputs`">`n                $inputHeader")

# Add headers to prim-failures
$failHeader = '<div class="prim-failure-header">
                  <div>Error Code</div><div>Action</div><div>Notes</div>
                </div>'
$content = $content.Replace('<div class="prim-failures">', "<div class=`"prim-failures`">`n                $failHeader")

# Update threshold default
$content = $content.Replace('threshold = EvaluationConfig.getThreshold(task_id)', 'threshold = EvaluationConfig.getThreshold(task_id) // default: 80')
$content = $content.Replace('passed = (score >= threshold)', 'passed = (score >= threshold)
                  <div class="prim-step"><span class="prim-step-num">07b</span><span class="prim-step-cmd"><span class="cm">// Multi-evaluator consensus: supermajority 2/3 required for high-value tasks</span></span></div>')

# Update nonce increment text
$content = $content.Replace('Initial protocol nonce. Increments on each signed action.', 'Initial protocol nonce. Increments ONLY after confirmed tx.')

# Add copy script at the end
$copyScript = @"
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
"@
$content = $content.Replace('</body>', $copyScript)

[System.IO.File]::WriteAllText($path, $content)

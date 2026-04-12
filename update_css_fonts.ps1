$path = "c:\Users\perpl\aequitaslabs-new\style.css"
$content = [System.IO.File]::ReadAllText($path)

$content = $content -replace "'DM Sans',sans-serif", "'Coinbase Display', 'Inter', 'DM Sans', sans-serif"
$content = $content -replace "'Cormorant Garamond',serif", "'Coinbase Display', 'Inter', 'DM Sans', sans-serif"
$content = $content -replace "'DM Mono',monospace", "'Coinbase Mono', 'JetBrains Mono', monospace"

# Add Base dot grid pattern and Toast notifications
$addPattern = @"

/* â”€â”€ TOAST NOTIFICATIONS â”€â”€ */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 99999;
}
.base-toast {
  background: var(--surface);
  border: 1px solid var(--rim);
  border-left: 4px solid var(--base-blue);
  color: var(--text-1);
  padding: 16px 20px;
  border-radius: var(--r-sm);
  font-family: 'Coinbase Display', 'Inter', 'DM Sans', sans-serif;
  font-size: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transform: translateX(20px);
  animation: toastFadeIn 0.3s ease forwards;
  display: flex;
  align-items: center;
  gap: 12px;
}
.base-toast.hiding {
  animation: toastFadeOut 0.3s ease forwards;
}
@keyframes toastFadeIn {
  to { opacity: 1; transform: translateX(0); }
}
@keyframes toastFadeOut {
  to { opacity: 0; transform: translateX(20px); }
}
"@

if ($content -notmatch "toastFadeIn") {
    $content += $addPattern
}

[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "Updated fonts and added toast in style.css"

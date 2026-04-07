$files = @("index.html", "waitlist.html", "whitepaper.html", "protocol-design.html", "docs.html", "faq.html", "applications.html", "404.html")
$faviconRegex = '<link rel="icon" type="image/svg\+xml" href="data:image/svg\+xml,[^"]*"/>'
$newFavicon = '<link rel="icon" type="image/png" href="assets/aequitas-pfp-400x400.png"/>'

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content -Raw $f
        # Replace the dummy logic for SVG logo
        $content = [regex]::Replace($content, '(?s)<div class="logo-mark">\s*<svg.*?</svg>\s*</div>', '<div class="logo-mark"><img src="assets/aequitas-pfp-400x400.png" alt="AequitasLabs Logo" style="width:100%;height:100%;object-fit:contain;"></div>')
        # Replace favicon
        $content = [regex]::Replace($content, $faviconRegex, $newFavicon)
        
        Set-Content -Path $f -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated $f"
    }
}

$dappFiles = @("dapp\pages\index.tsx", "dapp\pages\app.tsx")
foreach ($f in $dappFiles) {
    if (Test-Path $f) {
        $content = Get-Content -Raw $f
        $dummyLogoRegex = "(?s)<div style={{ width: '24px', height: '24px', border: '1px solid #C9A84C'.*?</div>\s*</div>"
        $newLogoDapp = '<img src="https://aequitaslabs.xyz/assets/aequitas-pfp-400x400.png" alt="AequitasLabs Logo" style={{ width: ''24px'', height: ''24px'', objectFit: ''contain'' }} />'
        $content = [regex]::Replace($content, $dummyLogoRegex, $newLogoDapp)
        Set-Content -Path $f -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated $f"
    }
}

$docFile = "dapp\pages\_document.tsx"
if (Test-Path $docFile) {
    $content = Get-Content -Raw $docFile
    $newFaviconAbs = '<link rel="icon" type="image/png" href="https://aequitaslabs.xyz/assets/aequitas-pfp-400x400.png"/>'
    $content = [regex]::Replace($content, $faviconRegex, $newFaviconAbs)
    Set-Content -Path $docFile -Value $content -NoNewline -Encoding UTF8
    Write-Host "Updated $docFile"
}

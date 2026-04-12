$dir = "c:\Users\perpl\aequitaslabs-new"
$extensions = @("*.html", "*.tsx")

$files = Get-ChildItem -Path $dir -Include $extensions -Recurse | Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" }

foreach ($f in $files) {
    if (Test-Path $f.FullName) {
        $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        $orig = $content
        
        # Replace prel-logo text
        $content = [regex]::Replace($content, '<div class="prel-logo">Base</div>', '<div class="prel-logo"><img src="assets/aequitaslabs-logo-dark.png" alt="Aequitas Labs" style="width: 32px;"/></div>')
        
        # Replace footer-logo text
        $content = [regex]::Replace($content, '<div class="footer-logo">Base</div>', '<div class="footer-logo"><img src="assets/aequitaslabs-logo-dark.png" alt="Aequitas Labs" style="width: 24px; vertical-align: middle;"/> Aequitas Labs</div>')
        
        # Replace logo-name text and styles
        # Old: <div class="logo-name" style="font-family: 'Coinbase Display', 'Inter', sans-serif; font-size: 24px; font-weight: 700; color: #0052FF; letter-spacing: -0.02em;">Base</div>
        $content = [regex]::Replace($content, '(?s)<div class="logo-name"[^>]*>Base</div>', '<div class="logo-name" style="display: flex; align-items: center; gap: 8px;"><img src="assets/aequitaslabs-logo-dark.png" alt="Aequitas Labs" style="height: 24px; width: auto;"/> <span style="font-family: ''Inter'', sans-serif; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.02em;">aequitas <span style="color: #0052FF">labs</span></span></div>')
        
        # Fix base URL in github link just in case
        $content = [regex]::Replace($content, 'https://github.com/base/base', 'https://github.com/aequitaslabs/aequitaslabs')
        $content = [regex]::Replace($content, 'https://twitter.com/base', 'https://twitter.com/aequitaslabs')
        
        if ($content -cne $orig) {
            [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Injected image logos to $($f.Name)"
        }
    }
}

$dir = "c:\Users\perpl\aequitaslabs-new"
$extensions = @("*.html", "*.tsx", "*.ts", "*.json")

$replacements = @(
    @("Base | Autonomous Capital on Base", "Aequitas Labs | Autonomous Capital on Base"),
    @('property="og:title" content="Base"', 'property="og:title" content="Aequitas Labs"'),
    @('property="og:site_name" content="Base"', 'property="og:site_name" content="Aequitas Labs"'),
    @('Base Agent Kit (BAK-1)', 'Aequitas Agent Kit (AQL-1)'),
    @('Base Agent Kit', 'Aequitas Agent Kit'),
    @('BAK-1', 'AQL-1'),
    @('© 2026 Base.', '© 2026 Aequitas Labs.'),
    @('content="https://base.xyz/assets/base-solana-banner.png"', 'content="https://aequitaslabs.xyz/assets/aequitaslabs-banner-1500x500.png"')
)

$files = Get-ChildItem -Path $dir -Include $extensions -Recurse | Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" }

foreach ($f in $files) {
    if (Test-Path $f.FullName) {
        $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        $orig = $content
        
        foreach ($pair in $replacements) {
            $content = $content.Replace($pair[0], $pair[1])
        }

        # Replace text logos with image tag (Specific for static .html files using relative path)
        if ($f.Extension -eq ".html") {
            $content = [regex]::Replace($content, '<span style="color:#0052FF;font-weight:800">Base</span>', '<img src="assets/aequitaslabs-logo-dark.png" alt="Aequitas Labs" style="height: 28px; width: auto;" />')
        }
        # DApp / root level .tsx components
        elseif ($f.Extension -eq ".tsx" -or $f.Extension -eq ".ts") {
            $content = [regex]::Replace($content, '<span style="color:#0052FF;font-weight:800">Base</span>', '<img src="/assets/aequitaslabs-logo-dark.png" alt="Aequitas Labs" style={{ height: "28px", width: "auto" }} />')
        }

        # Any explicit lingering "base-xyz" banner references
        $content = [regex]::Replace($content, 'https://base.md/assets/base-banner.png', 'https://aequitaslabs.xyz/assets/aequitaslabs-banner-1500x500.png')
        
        if ($content -cne $orig) {
            [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Re-integrated Aequitas in $($f.Name)"
        }
    }
}

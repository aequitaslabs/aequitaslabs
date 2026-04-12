$DIR = "c:\Users\perpl\aequitaslabs-new"

function Process-File {
    param([string]$FilePath)

    # Exclude irrelevant directories
    if ($FilePath -match '\\\.git\\' -or $FilePath -match '\\node_modules\\' -or $FilePath -match '\\\.next\\') {
        return
    }

    $original = [System.IO.File]::ReadAllText($FilePath)
    $content = $original

    # Title and og
    $content = [regex]::Replace($content, '(?i)<title>.*?</title>', '<title>Base | Autonomous Capital on Solana</title>')
    $content = [regex]::Replace($content, '(?i)<meta property="og:title" content=".*?"\s*/>', '<meta property="og:title" content="Base | Autonomous Capital on Solana"/>')
    $content = [regex]::Replace($content, '(?i)<meta property="og:site_name" content=".*?"\s*/>', '<meta property="og:site_name" content="Base"/>')

    # Nav logo
    $logoInner = '<div class="logo-name" style="font-family: ''Coinbase Display'', ''Inter'', sans-serif; font-size: 24px; font-weight: 700; color: #0052FF; letter-spacing: -0.02em;">Base</div>'
    $content = [regex]::Replace($content, '(?si)<div class="logo-mark">.*?</div>\s*<div class="logo-wordmark">.*?</div>', $logoInner)
    $content = [regex]::Replace($content, '(?si)<img[^>]*src="[^"]*aequitas-pfp-400x400\.png"[^>]*>', '')

    # Text Replacements (Case sensitive replacements using string replace method)
    $content = $content.Replace("AequitasLabs", "Base")
    $content = $content.Replace("Aequitas Labs", "Base")
    $content = $content.Replace("aequitaslabs", "base")
    $content = $content.Replace("Aequitas", "Base")
    $content = $content.Replace("aequitas", "base")
    $content = $content.Replace("AEQUITAS", "BASE")

    if ($original -cne $content) {
        [System.IO.File]::WriteAllText($FilePath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($FilePath)"
    }
}

$files = Get-ChildItem -Path $DIR -Recurse -File -Include *.html,*.js,*.css,*.ts,*.tsx,*.json,*.md,*.txt
foreach ($file in $files) {
    Process-File -FilePath $file.FullName
}

Write-Host "Done"

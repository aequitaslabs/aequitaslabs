$replacements = @{
    "â€”" = "—"
    "â€¦" = "…"
    "Â·" = "·"
    "â†’" = "→"
    "â‰¥" = "≥"
    "â‰ " = "≠"
    "â€œ" = "“"
    "â€"  = "”"
    "â€™" = "’"
    "â€˜" = "‘"
    "â€“" = "–"
    "â€¢" = "•"
    "â—"  = "—"
    "â•"  = "═"
    "â”"  = "─"
}

$files = Get-ChildItem -Filter *.html
$files += Get-ChildItem -Filter style.css
$files += Get-ChildItem -Filter *.md

foreach ($f in $files) {
    if ($f.Name -match "demo|404|archive") { continue }
    $text = Get-Content -Path $f.FullName -Raw -Encoding UTF8
    
    foreach ($key in $replacements.Keys) {
        if ($text.Contains($key)) {
            $text = $text.Replace($key, $replacements[$key])
        }
    }
    Set-Content -Path $f.FullName -Value $text -Encoding UTF8
}
Write-Host "Un-Mojibaked!"

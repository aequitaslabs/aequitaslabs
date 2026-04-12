$dir = "c:\Users\perpl\aequitaslabs-new"
$extensions = @("*.html", "*.tsx", "*.ts", "*.css", "*.js", "*.json")

$files = Get-ChildItem -Path $dir -Include $extensions -Recurse | Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" }

foreach ($f in $files) {
    if (Test-Path $f.FullName) {
        $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        $orig = $content
        
        $content = [regex]::Replace($content, '\bSolana\b', 'Base')
        $content = [regex]::Replace($content, '\bsolana\b(?!\.js|\.ps1|\.py)', 'base')
        $content = [regex]::Replace($content, '\bSOLANA\b', 'BASE')
        $content = [regex]::Replace($content, 'Solana-Native', 'Base-Native')
        
        if ($content -cne $orig) {
            [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Scrubbed Solana from $($f.Name)"
        }
    }
}

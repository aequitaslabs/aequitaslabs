$DIR = "c:\Users\perpl\aequitaslabs-new"
$files = Get-ChildItem -Path $DIR -Recurse -File -Include *.html,*.css,*.js,*.ts,*.tsx

foreach ($file in $files) {
    if ($file.FullName -match 'node_modules' -or $file.FullName -match '\.next') { continue }
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content
    
    # Class names/IDs prefix
    $content = $content -replace 'aequitas-', 'base-'
    
    # CSS variable name changes
    $content = $content -replace '--solana-purple', '--base-blue'
    $content = $content -replace '--solana-green', '--success-green'
    $content = $content -replace '--solana-glow', '--base-glow'

    if ($original -cne $content) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Replaced CSS classes in $($file.FullName)"
    }
}

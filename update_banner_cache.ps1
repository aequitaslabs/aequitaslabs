$oldBanner = "aequitaslabs-banner-1500x500.png"
$newBanner = "banner-v2-1500x500.png"

# Rename file
if (Test-Path "assets\$oldBanner") {
    Rename-Item -Path "assets\$oldBanner" -NewName $newBanner
}

# Update all HTML files and dapp files
$files = Get-ChildItem -Path . -Recurse -Include *.html, *.tsx | Where-Object { $_.FullName -notmatch "node_modules|\.git" }

foreach ($f in $files) {
    $content = Get-Content -Raw $f.FullName
    if ($content -match $oldBanner) {
        $content = $content -replace $oldBanner, $newBanner
        Set-Content -Path $f.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated $($f.FullName)"
    }
}

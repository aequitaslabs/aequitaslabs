$files = Get-ChildItem -Filter *.html
foreach ($file in $files) {
    if ($file.Name -eq 'index.html') {
        continue
    }
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content -replace '<a href="waitlist.html" class="btn-ghost">Join Waitlist</a>', '<a href="https://flaunch.gg/base/coins/0x0B91DD28734da01eA53Ac1A44384C12395492619" target="_blank" class="btn-ghost" style="color: #00D2FF; border-color: rgba(0, 210, 255, 0.3);">Buy $AEQUITAS</a>'
    
    # Also replace "Buy Token" to "Buy $AEQUITAS" in case something was missed or has it.
    $newContent = $newContent -replace 'Buy Token', 'Buy $AEQUITAS'

    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Updated $($file.Name)"
    }
}

$desc = 'Deposit USDC. Let autonomous AI agents allocate capital into tokenized real estate on Solana, hire specialized agents via Solana Agent Kit (SAK-1), and distribute real yield.'
$files = Get-ChildItem -Path . -Recurse -Include *.html, *.tsx | Where-Object { $_.FullName -notmatch "node_modules|\.git|\.next" }
foreach ($f in $files) {
    $c = Get-Content -Raw $f.FullName
    $modified = $false
    if ($c -match 'content="Deposit USDC\. Our agent allocates into RWA on Solana, hires sub-agents, and pays you yield\."') {
        $c = $c -replace 'content="Deposit USDC\. Our agent allocates into RWA on Solana, hires sub-agents, and pays you yield\."', "content=`"$desc`""
        $modified = $true
    }
    if ($c -match 'content="Deploy USDC via agent smart contracts\."') {
        $c = $c -replace 'content="Deploy USDC via agent smart contracts\."', "content=`"$desc`""
        $modified = $true
    }
    if ($c -match 'content="Autonomous AI agents execute tasks, verify outputs, and earn on-chain through trustless escrow\. Built on Base\. ERC-8183 protocol\."') {
        $c = $c -replace 'content="Autonomous AI agents execute tasks, verify outputs, and earn on-chain through trustless escrow\. Built on Base\. ERC-8183 protocol\."', "content=`"$desc`""
        $modified = $true
    }
    if ($c -match "aequitaslabs-banner-1500x500\.png") {
        $c = $c -replace "aequitaslabs-banner-1500x500\.png", "aequitaslabs-solana-banner.png"
        $modified = $true
    }
    if ($modified) {
        Set-Content -Path $f.FullName -Value $c -NoNewline -Encoding UTF8
        Write-Output "Updated $($f.Name)"
    }
}
if (Test-Path "assets\aequitaslabs-banner-1500x500.png") {
    Rename-Item -Path "assets\aequitaslabs-banner-1500x500.png" -NewName "aequitaslabs-solana-banner.png"
    Write-Output "Renamed banner file"
}

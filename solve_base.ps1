$files = @(
    "c:\Users\perpl\aequitaslabs-new\docs.html",
    "c:\Users\perpl\aequitaslabs-new\whitepaper.html"
)

$replacements = @(
    @("Solana Agent Kit (SAK-1)", "Base Agent Kit (BAK-1)"),
    @("SAK-1", "BAK-1"),
    @("Solana Programs", "Base Smart Contracts"),
    @("Solana Program", "Base Smart Contract"),
    @("Solana Network", "Base Network"),
    @("Solana Testnet", "Base Sepolia Testnet"),
    @("Solana L1", "Base L2"),
    @("Built on Solana", "Built on Base"),
    @("on Solana", "on Base"),
    @("via Solana", "via Base"),
    @("network: solana", "network: base"),
    @("protocol: Solana Agent Kit (SAK-1)", "protocol: Base Agent Kit (BAK-1)"),
    @("protocol:    Solana Agent Kit (SAK-1)", "protocol: Base Agent Kit (BAK-1)"),
    @("network:     solana", "network:  base"),
    @("environment: testnet", "environment: base-sepolia"),
    @("0.01 SOL", "0.001 ETH"),
    @("0.5 SOL", "0.005 ETH"),
    @("0.05 SOL", "0.0005 ETH"),
    @("SOL to lock", "ETH to lock"),
    @("base58-encoded Solana address. Used for signing and receiving payment.", "EVM-compatible address. Used for signing and receiving payment."),
    @("base58-encoded Solana address", "EVM-compatible wallet address"),
    @("400ms block time", "2s block time"),
    @("Sub-.001 fees", "Sub-$0.01 fees"),
    @("--solana-purple", "--base-blue"),
    @("--solana-green", "--base-blue-light"),
    @("#9945FF", "#0052FF"),
    @("#14F195", "#3374FF"),
    @("#9945ff", "#0052FF"),
    @("#14f195", "#3374FF"),
    @("rgba(153,69,255", "rgba(0,82,255"),
    @("rgba(153, 69, 255", "rgba(0, 82, 255")
)

foreach ($filepath in $files) {
    if (Test-Path $filepath) {
        $content = [System.IO.File]::ReadAllText($filepath)
        
        foreach ($pair in $replacements) {
            $content = $content.Replace($pair[0], $pair[1])
        }
        
        $content = [regex]::Replace($content, '\bSOL\b', 'ETH')
        $content = [regex]::Replace($content, '\bSolana\b', 'Base')
        $content = [regex]::Replace($content, '\bsolana\b', 'base')
        
        [System.IO.File]::WriteAllText($filepath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($filepath)"
    } else {
        Write-Host "File not found: $($filepath)"
    }
}

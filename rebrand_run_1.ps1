$dir = "c:\Users\perpl\aequitaslabs-new"
$extensions = @("*.html", "*.tsx", "*.ts", "*.css", "*.json", "*.js")
$excludeDirs = @("node_modules", ".next", ".git")

$replacements = @(
    @("AequitasLabs", "Base"),
    @("Aequitas Labs", "Base"),
    @("aequitaslabs", "base"),
    @("Aequitas", "Base"),
    @("aequitas", "base"),
    @("Solana Agent Kit (SAK-1)", "Base Agent Kit (BAK-1)"),
    @("Solana Agent Kit", "Base Agent Kit"),
    @("SAK-1", "BAK-1"),
    @("Solana Programs", "Base Smart Contracts"),
    @("Solana Program", "Base Smart Contract"),
    @("Solana Network", "Base Network"),
    @("Solana Testnet", "Base Sepolia Testnet"),
    @("Built on Solana", "Built on Base"),
    @("Solana L1", "Base L2"),
    @("on Solana", "on Base"),
    @("via Solana", "via Base"),
    @("Solana-Native", "Base-Native"),
    @("400ms block time", "2s block time"),
    @("Sub-.001 fees", "Sub-$0.01 fees"),
    @("network: solana", "network: base"),
    @("environment: testnet", "environment: base-sepolia"),
    @("protocol: Solana Agent Kit", "protocol: Base Agent Kit (BAK-1)"),
    @("0.01 SOL", "0.001 ETH"),
    @("0.5 SOL", "0.005 ETH"),
    @("0.05 SOL", "0.0005 ETH"),
    @("SOL to lock", "ETH to lock"),
    @("base58-encoded Solana address", "EVM-compatible wallet address"),
    @("--solana-purple", "--base-blue"),
    @("--solana-green", "--base-blue-light"),
    @("--solana-glow", "--base-glow"),
    @("#9945FF", "#0052FF"),
    @("#14F195", "#3374FF"),
    @("#9945ff", "#0052FF"),
    @("#14f195", "#3374FF"),
    @("rgba(153,69,255", "rgba(0,82,255"),
    @("rgba(153, 69, 255", "rgba(0, 82, 255"),
    @('background:rgba(153,69,255,0.4)', 'background:rgba(0,82,255,0.4)'),
    @("aequitas-", "base-"),
    @("solana-", "base-"),
    @('Cormorant Garamond', 'Coinbase Display'),
    @('DM Mono', 'Coinbase Mono')
)

$files = Get-ChildItem -Path $dir -Include $extensions -Recurse | Where-Object {
    $path = $_.FullName
    $skip = $false
    foreach ($ex in $excludeDirs) {
        if ($path -match "\\$ex\\") { $skip = $true; break }
    }
    -not $skip
}

foreach ($f in $files) {
    if (Test-Path $f.FullName) {
        $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        $orig = $content
        
        foreach ($pair in $replacements) {
            $content = $content.Replace($pair[0], $pair[1])
        }
        
        # Word SOL -> ETH (prevent inside .sol)
        $content = [regex]::Replace($content, '\bSOL\b(?!\.sol)', 'ETH')
        
        # Specific meta and title
        $content = [regex]::Replace($content, '(?s)<title>.*?</title>', '<title>Base | Autonomous Capital on Base</title>')
        $content = [regex]::Replace($content, '(?i)<meta property="og:title" content=".*?"\s*/?>', '<meta property="og:title" content="Base" />')
        $content = [regex]::Replace($content, '(?i)<meta property="og:site_name" content=".*?"\s*/?>', '<meta property="og:site_name" content="Base" />')
        $content = [regex]::Replace($content, '(?i)<meta property="og:description" content=".*?"\s*/?>', '<meta property="og:description" content="Autonomous capital deployed by AI agents. Deposit USDC. Earn real yield. All onchain." />')
        
        # Remove old image logos and insert Text Wordmark
        # Matches <div class="logo-mark">...</div> or similar
        $content = [regex]::Replace($content, '(?s)<div class="logo-mark">.*?</div>', '<span style="color:#0052FF;font-weight:800">Base</span>')
        $content = [regex]::Replace($content, '(?s)<img[^>]*src="[^"]*aequitas[^"]*"[^>]*>', '<span style="color:#0052FF;font-weight:800">Base</span>')
        
        # Footer Tagline
        $content = [regex]::Replace($content, 'Your USDC\. Managed Onchain by Autonomous Agents\.', 'Your capital. Managed onchain by autonomous agents.')
        $content = [regex]::Replace($content, 'Your capital\. Managed Onchain by Autonomous Agents\.', 'Your capital. Managed onchain by autonomous agents.')

        # Hero text
        $content = [regex]::Replace($content, 'Autonomous Capital\.\s*</span>\s*<em class="accent">Onchain\.</em>', 'Autonomous Capital.</span> <em class="accent">Onchain.</em>')
        # We'll fix hero text manually if needed
        
        # Fonts
        $content = [regex]::Replace($content, "'Coinbase Display',\s*'serif'", "'Coinbase Display', 'Inter', 'DM Sans', sans-serif")
        $content = [regex]::Replace($content, "'Coinbase Mono',\s*'monospace'", "'Coinbase Mono', 'JetBrains Mono', monospace")

        if ($content -cne $orig) {
            [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Replaced strings in $($f.Name)"
        }
    }
}

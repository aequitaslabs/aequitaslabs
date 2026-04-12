const fs = require('fs');

const files = [
    "c:\\Users\\perpl\\aequitaslabs-new\\docs.html",
    "c:\\Users\\perpl\\aequitaslabs-new\\whitepaper.html"
];

const exactReplacements = [
    ["Solana Agent Kit (SAK-1)", "Base Agent Kit (BAK-1)"],
    ["SAK-1", "BAK-1"],
    ["Solana Programs", "Base Smart Contracts"],
    ["Solana Program", "Base Smart Contract"],
    ["Solana Network", "Base Network"],
    ["Solana Testnet", "Base Sepolia Testnet"],
    ["Solana L1", "Base L2"],
    ["Built on Solana", "Built on Base"],
    ["on Solana", "on Base"],
    ["via Solana", "via Base"],
    ["network: solana", "network: base"],
    ["protocol: Solana Agent Kit (SAK-1)", "protocol: Base Agent Kit (BAK-1)"],
    ["protocol:    Solana Agent Kit (SAK-1)", "protocol: Base Agent Kit (BAK-1)"],
    ["network:     solana", "network:  base"],
    ["environment: testnet", "environment: base-sepolia"],
    
    // Currency
    ["0.01 SOL", "0.001 ETH"],
    ["0.5 SOL", "0.005 ETH"],
    ["0.05 SOL", "0.0005 ETH"],
    ["SOL to lock", "ETH to lock"],
    
    // Address Format
    ["base58-encoded Solana address. Used for signing and receiving payment.", "EVM-compatible address. Used for signing and receiving payment."],
    ["base58-encoded Solana address", "EVM-compatible wallet address"],
    
    // Stats & Perf
    ["400ms block time", "2s block time"],
    ["Sub-.001 fees", "Sub-$0.01 fees"],
    
    // Colors
    ["--solana-purple", "--base-blue"],
    ["--solana-green", "--base-blue-light"],
    ["#9945FF", "#0052FF"],
    ["#14F195", "#3374FF"],
    ["#9945ff", "#0052FF"],
    ["#14f195", "#3374FF"],
    ["rgba(153,69,255", "rgba(0,82,255"],
    ["rgba(153, 69, 255", "rgba(0, 82, 255"]
];

for (const filepath of files) {
    if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf8');
        
        for (const [oldText, newText] of exactReplacements) {
            content = content.split(oldText).join(newText);
        }
        
        // Match SOL but not part of .sol
        content = content.replace(/\bSOL\b/g, 'ETH');
        
        // Match Solana and solana exactly everywhere else
        content = content.replace(/\bSolana\b/g, 'Base');
        content = content.replace(/\bsolana\b/g, 'base');
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    } else {
        console.log(`File not found: ${filepath}`);
    }
}

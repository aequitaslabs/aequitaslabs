const fs = require('fs');

const files = [
    "c:\\Users\\perpl\\base-new\\docs.html",
    "c:\\Users\\perpl\\base-new\\whitepaper.html"
];

const exactReplacements = [
    ["Base Agent Kit (BAK-1)", "Base Agent Kit (BAK-1)"],
    ["BAK-1", "BAK-1"],
    ["Base Smart Contracts", "Base Smart Contracts"],
    ["Base Smart Contract", "Base Smart Contract"],
    ["Base Network", "Base Network"],
    ["Base Sepolia Testnet", "Base Sepolia Testnet"],
    ["Base L2", "Base L2"],
    ["Built on Base", "Built on Base"],
    ["on Base", "on Base"],
    ["via Base", "via Base"],
    ["network: base", "network: base"],
    ["protocol: Base Agent Kit (BAK-1)", "protocol: Base Agent Kit (BAK-1)"],
    ["protocol:    Base Agent Kit (BAK-1)", "protocol: Base Agent Kit (BAK-1)"],
    ["network:     base", "network:  base"],
    ["environment: base-sepolia", "environment: base-sepolia"],
    
    // Currency
    ["0.001 ETH", "0.001 ETH"],
    ["0.005 ETH", "0.005 ETH"],
    ["0.0005 ETH", "0.0005 ETH"],
    ["ETH to lock", "ETH to lock"],
    
    // Address Format
    ["EVM-compatible wallet address. Used for signing and receiving payment.", "EVM-compatible address. Used for signing and receiving payment."],
    ["EVM-compatible wallet address", "EVM-compatible wallet address"],
    
    // Stats & Perf
    ["2s block time", "2s block time"],
    ["Sub-.01 fees", "Sub-$0.01 fees"],
    
    // Colors
    ["--base-blue", "--base-blue"],
    ["--base-blue-light", "--base-blue-light"],
    ["#0052FF", "#0052FF"],
    ["#3374FF", "#3374FF"],
    ["#0052FF", "#0052FF"],
    ["#3374FF", "#3374FF"],
    ["rgba(0,82,255", "rgba(0,82,255"],
    ["rgba(0, 82, 255", "rgba(0, 82, 255"]
];

for (const filepath of files) {
    if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf8');
        
        for (const [oldText, newText] of exactReplacements) {
            content = content.split(oldText).join(newText);
        }
        
        // Match ETH but not part of .sol
        content = content.replace(/\bSOL\b/g, 'ETH');
        
        // Match Base and base exactly everywhere else
        content = content.replace(/\bSolana\b/g, 'Base');
        content = content.replace(/\bsolana\b/g, 'base');
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    } else {
        console.log(`File not found: ${filepath}`);
    }
}

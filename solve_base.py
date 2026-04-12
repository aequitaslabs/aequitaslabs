import os
import re

files_to_update = [
    r"c:\Users\perpl\aequitaslabs-new\docs.html",
    r"c:\Users\perpl\aequitaslabs-new\whitepaper.html"
]

replacements = [
    ("Solana Agent Kit (SAK-1)", "Base Agent Kit (BAK-1)"),
    ("SAK-1", "BAK-1"),
    ("Solana Programs", "Base Smart Contracts"),
    ("Solana Program", "Base Smart Contract"),
    ("Solana Network", "Base Network"),
    ("Solana Testnet", "Base Sepolia Testnet"),
    ("Solana L1", "Base L2"),
    ("Built on Solana", "Built on Base"),
    ("on Solana", "on Base"),
    ("via Solana", "via Base"),
    ("network: solana", "network: base"),
    ("protocol: Solana Agent Kit (SAK-1)", "protocol: Base Agent Kit (BAK-1)"),
    ("protocol:    Solana Agent Kit (SAK-1)", "protocol: Base Agent Kit (BAK-1)"),
    ("network:     solana", "network:  base"),
    ("environment: testnet", "environment: base-sepolia"),
    
    # Currency
    ("0.01 SOL", "0.001 ETH"),
    ("0.5 SOL", "0.005 ETH"),
    ("0.05 SOL", "0.0005 ETH"),
    ("SOL to lock", "ETH to lock"),
    
    # Address Format
    ("base58-encoded Solana address", "EVM-compatible wallet address"),
    ("base58-encoded Solana address. Used for signing and receiving payment.", "EVM-compatible address. Used for signing and receiving payment."),
    
    # Stats & Perf
    ("400ms block time", "2s block time"),
    ("Sub-.001 fees", "Sub-$0.01 fees"),
    
    # Colors
    ("--solana-purple", "--base-blue"),
    ("--solana-green", "--base-blue-light"),
    ("#9945FF", "#0052FF"),
    ("#14F195", "#3374FF"),
    ("#9945ff", "#0052FF"),
    ("#14f195", "#3374FF"),
    ("rgba(153,69,255", "rgba(0,82,255"),
    ("rgba(153, 69, 255", "rgba(0, 82, 255")
]

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Exact replacements
        for old_text, new_text in replacements:
            content = content.replace(old_text, new_text)
            
        # Regex for word SOL -> ETH
        content = re.sub(r'\bSOL\b', 'ETH', content)

        # Ensure that case-insensitive 'Solana' catches any stray strings besides exact replacements
        # wait, the instruction says "Zero remaining occurrences of Solana (except inside .sol filenames)".
        # Let's replace any isolated 'Solana' with 'Base' (case-sensitive) and 'solana' with 'base' (if missing).
        # We need to be careful with word boundaries and not match '.sol'
        content = re.sub(r'\bSolana\b', 'Base', content)
        content = re.sub(r'\bsolana\b', 'base', content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"File not found: {filepath}")

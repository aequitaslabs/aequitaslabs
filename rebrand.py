import os
import re

DIR = r"c:\Users\perpl\aequitaslabs-new"

def process_file(filepath):
    # Only process target text files
    if not filepath.endswith(('.html', '.js', '.css', '.ts', '.tsx', '.json', '.md', '.txt')):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            content = f.read()
        except:
            return  # skip binary or unreadable

    original = content

    # 1. Standardize Title and og tags
    content = re.sub(r'<title>.*?</title>', '<title>Base | Autonomous Capital on Solana</title>', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta property="og:title" content=".*?"\s*/>', '<meta property="og:title" content="Base | Autonomous Capital on Solana"/>', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta property="og:site_name" content=".*?"\s*/>', '<meta property="og:site_name" content="Base"/>', content, flags=re.IGNORECASE)

    # 2. Logo replacements in HTML
    # We want to replace the whole <div class="nav-logo">...</div> 
    # Notice this is tricky with regex, so we target the inner parts
    logo_inner = """<div class="logo-name" style="font-family: 'Coinbase Display', 'Inter', sans-serif; font-size: 24px; font-weight: 700; color: #0052FF; letter-spacing: -0.02em;">Base</div>"""
    content = re.sub(
        r'<div class="logo-mark">.*?</div>\s*<div class="logo-wordmark">.*?</div>',
        logo_inner,
        content,
        flags=re.IGNORECASE | re.DOTALL
    )

    # Some footers don't have logo-wordmark.
    content = re.sub(r'<img[^>]*src="[^"]*aequitas-pfp-400x400\.png"[^>]*>', '', content)

    # 3. Text Replacements (Case sensitive for right bounds)
    content = content.replace("AequitasLabs", "Base")
    content = content.replace("Aequitas Labs", "Base")
    content = content.replace("aequitaslabs", "base")
    content = content.replace("Aequitas", "Base")
    content = content.replace("aequitas", "base")
    content = content.replace("AEQUITAS", "BASE")

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(DIR):
    if '.git' in root or 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        process_file(os.path.join(root, file))

print("Done")

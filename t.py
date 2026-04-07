import os
import re

directory = "c:\\Users\\perpl\\aequitaslabs-new"

# Regex for replacing SVG logo with new image
logo_pattern = re.compile(r'<div class="logo-mark">\s*<svg.*?</svg>\s*</div>', re.DOTALL)
new_logo = '<div class="logo-mark"><img src="assets/aequitas-pfp-400x400.png" alt="AequitasLabs Logo" style="width:100%;height:100%;object-fit:contain;"></div>'

new_logo_abs = '<div class="logo-mark"><img src="https://aequitaslabs.xyz/assets/aequitas-pfp-400x400.png" alt="AequitasLabs Logo" style="width:100%;height:100%;object-fit:contain;"></div>'

# Regex for favicon
favicon_pattern = re.compile(r'<link rel="icon" type="image/svg\+xml" href="data:image/svg\+xml,[^"]*"/>')
new_favicon = '<link rel="icon" type="image/png" href="assets/aequitas-pfp-400x400.png"/>'
new_favicon_abs = '<link rel="icon" type="image/png" href="https://aequitaslabs.xyz/assets/aequitas-pfp-400x400.png"/>'


for root, dirs, files in os.walk(directory):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.html') or file.endswith('.tsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            is_dapp = "dapp" in root or "dapp\\pages" in root

            original_content = content

            if not is_dapp:
                content = logo_pattern.sub(new_logo, content)
                content = favicon_pattern.sub(new_favicon, content)
            else:
                # for dapp
                content = favicon_pattern.sub(new_favicon_abs, content)
                # also replace the custom inline dummy logo
                dummy_logo_pattern = re.compile(r'<div style={{ width: \'24px\', height: \'24px\', border: \'1px solid #C9A84C.*?</div\s*>', re.DOTALL)
                content = dummy_logo_pattern.sub('<img src="https://aequitaslabs.xyz/assets/aequitas-pfp-400x400.png" alt="AequitasLabs Logo" style={{ width: \'24px\', height: \'24px\', objectFit: \'contain\' }} />', content)


            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file_path}")

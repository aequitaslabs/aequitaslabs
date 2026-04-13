import os
import glob
import re

files_to_update = glob.glob('*.html')
nav_cta_pattern = re.compile(
    r'<div class="nav-cta">\s*<a href="waitlist.html" class="btn-ghost">Join Waitlist</a>\s*<a href="#" class="btn-primary" onclick="event.preventDefault\(\); openComingSoonModal\(\);">Launch App</a>\s*<button class="mobile-toggle" aria-label="Toggle Mobile Menu" onclick="toggleMobileMenu\(\)">\s*<span></span><span></span><span></span>\s*</button>\s*</div>',
    re.MULTILINE
)

replacement = """    <div class="nav-cta">
      <a href="https://flaunch.gg/base/coins/0x0B91DD28734da01eA53Ac1A44384C12395492619" target="_blank" class="btn-ghost" style="color: #00D2FF; border-color: rgba(0, 210, 255, 0.3);">Buy $AEQUITAS</a>
      <a href="#" class="btn-primary" onclick="event.preventDefault(); openComingSoonModal();">Launch App</a>
      <button class="mobile-toggle" aria-label="Toggle Mobile Menu" onclick="toggleMobileMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>"""

for file in files_to_update:
    if file == 'index.html':
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if nav_cta_pattern.search(content):
        # Check if the CTA has Waitlist text just in case my regex differs slightly
        pass
        
    # a simpler replace might be better since I already verified it line by line
    new_content = content.replace(
        '<a href="waitlist.html" class="btn-ghost">Join Waitlist</a>',
        '<a href="https://flaunch.gg/base/coins/0x0B91DD28734da01eA53Ac1A44384C12395492619" target="_blank" class="btn-ghost" style="color: #00D2FF; border-color: rgba(0, 210, 255, 0.3);">Buy $AEQUITAS</a>'
    )
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

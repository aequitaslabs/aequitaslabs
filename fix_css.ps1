$path = "c:\Users\perpl\aequitaslabs-new\style.css"
$content = [System.IO.File]::ReadAllText($path)

# Look for the broken variable list at the top and replace it with a clean :root block
$cleanRoot = @"

/* â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•  TOKENS â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•  */
:root {
  --black:       #000000;
  --ink:         #0A0A0A;
  --surface:     #111111;
  --surface-2:   #1A1A1A;
  --glass:       rgba(255,255,255,0.028);
  --glass-2:     rgba(255,255,255,0.05);
  --rim:         #222222;
  --rim-2:       rgba(255,255,255,0.08);
  --base-blue:   #0052FF;
  --success-green: #00C851;
  --base-glow:   rgba(0,82,255,0.15);
  --gold: var(--base-blue);
  --gold-bright: #0052FF;
  --gold-dim:    #0052FF;
  --gold-glow:   rgba(0,82,255,0.15);
  --gold-soft:   rgba(0,82,255,0.08);
  --gold-pale:   rgba(0,82,255,0.04);
  --sand:        #ffffff;
  --text-1:  #FFFFFF;
  --text-2:  #8A8A8A;
  --text-3:  #55504a;
  --text-4:  #2e2c27;
  --r-xs: 8px; --r-sm: 16px; --r-md: 16px; --r-lg: 24px; --r-xl: 32px;
  --ease: cubic-bezier(0.16,1,0.3,1);
}
/* Launch safety overrides removed for premium animations */
"@

# Replace everything from the top down to `--ease: cubic-bezier... }`
$content = [regex]::Replace($content, '(?si)^.*?--ease: cubic-bezier\(0\.16,1,0\.3,1\);\s*\}', $cleanRoot)

[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)

Write-Host "Fixed CSS root!"

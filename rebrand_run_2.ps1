$dir = "c:\Users\perpl\aequitaslabs-new"

$cssBlock = @"

/* =========================================================================
   BASE DESIGN OVERRIDES (Global Rebrand) 
   ========================================================================= */

:root {
  --black: #0A0A0A;
  --surface: #111111;
  --rim: #222222;
  --rim-2: rgba(255,255,255,0.08);
  --base-blue: #0052FF;
  --base-blue-light: #3374FF;
  --text-1: #FFFFFF;
  --text-2: #8A8A8A;
}
body {
  background: var(--black) !important;
  color: var(--text-2) !important;
  font-family: 'Coinbase Display', 'Inter', 'DM Sans', sans-serif !important;
}
h1, h2, h3, h4, h5, h6, .hero-title, .card-title, .section-title {
  color: var(--text-1) !important;
  font-weight: 800 !important;
  letter-spacing: -0.03em !important;
  font-family: 'Coinbase Display', 'Inter', 'DM Sans', sans-serif !important;
}

/* NAVBAR */
nav, #navbar, .navbar {
  background: rgba(5,5,16,0.85) !important;
  backdrop-filter: blur(12px) !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
}
.nav-links a, .mobile-overlay-links a {
  color: rgba(255,255,255,0.6) !important;
}
.nav-links a:hover, .nav-links a.active, .mobile-overlay-links a:hover {
  color: #FFFFFF !important;
}

/* FOOTER */
footer {
  background: #050510 !important;
  border-top: 1px solid rgba(255,255,255,0.06) !important;
  position: relative;
  padding-bottom: 30px !important;
}
footer::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: rgba(0,82,255,0.4);
}
.footer-links a {
  color: rgba(255,255,255,0.4) !important;
}
.footer-links a:hover {
  color: #FFFFFF !important;
}

/* HERO */
#hero {
  background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px) !important;
  background-size: 32px 32px !important;
}

/* BUTTONS */
.btn-primary, .btn-hero-primary, .submit-btn, .cs-btn, button[type="submit"] {
  background: #0052FF !important;
  color: #FFFFFF !important;
  border-radius: 9999px !important;
  padding: 12px 28px !important;
  font-weight: 700 !important;
  border: none !important;
  transition: all 150ms ease !important;
}
.btn-primary:hover, .btn-hero-primary:hover, .submit-btn:hover, .cs-btn:hover, button[type="submit"]:hover {
  background: #0066FF !important;
  transform: translateY(-1px) !important;
  filter: brightness(1.1);
}
.btn-secondary, .btn-hero-secondary, .btn-ghost {
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.2) !important;
  color: #FFFFFF !important;
  border-radius: 9999px !important;
  padding: 12px 28px !important;
  transition: all 150ms ease !important;
}
.btn-secondary:hover, .btn-hero-secondary:hover, .btn-ghost:hover {
  background: rgba(255,255,255,0.06) !important;
}

/* CARDS */
.card, .module-card, .case-card, .flow-card, .why-card {
  background: #111111 !important;
  border: 1px solid #222222 !important;
  border-radius: 12px !important;
  transition: all 200ms ease !important;
}
.card:hover, .module-card:hover, .case-card:hover, .flow-card:hover, .why-card:hover {
  border-color: rgba(0,82,255,0.4) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 0 24px rgba(0,82,255,0.1) !important;
}

/* TAGS / PILLS / BADGES */
.tag, .tag-pill, .pill, .badge, .wp-meta-pill, .stat-label, .trust-badge, .stack-chip, .live-badge, .badge-system, .badge-task, .badge-eval, .badge-agent, .badge-pay {
  background: rgba(0,82,255,0.1) !important;
  border: 1px solid rgba(0,82,255,0.35) !important;
  color: #3374FF !important;
  border-radius: 9999px !important;
  font-size: 11px !important;
  letter-spacing: 0.08em !important;
}

/* CODE BLOCKS */
pre, code, .demo-right, .code-block, .log-line {
  background: #0D0D0D !important;
  border: 1px solid #1E1E1E !important;
  border-left: 3px solid #0052FF !important;
  font-family: 'Coinbase Mono', 'JetBrains Mono', monospace !important;
}
.log-line { border-left: none !important; }
.demo-right { border-left: 3px solid #0052FF !important; border-radius: 0 12px 12px 0 !important; }

/* TOAST NOTIF & ANIMATIONS */
.base-toast {
  border-radius: 8px !important;
  padding: 14px 20px !important;
  animation: toastFadeIn 200ms ease forwards !important;
}
.base-toast.hiding {
  animation: toastFadeOut 300ms ease forwards !important;
}
@keyframes toastFadeIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
@keyframes toastFadeOut { to { opacity: 0; transform: translateX(20px); } }

/* REMOVE GRADIENTS & CANVASES */
.gradient-text, .text-gradient, .accent {
  background: linear-gradient(135deg, #0052FF, #3374FF) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
}
#canvas-bg, #hero-canvas { display: none !important; }

"@

# Apply to style.css
$cssPath = "$dir\style.css"
if (Test-Path $cssPath) {
    $content = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)
    if ($content -notmatch "BASE DESIGN OVERRIDES") {
        $content += "`n" + $cssBlock
        [System.IO.File]::WriteAllText($cssPath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Injected global overrides into style.css"
    }
}

# Apply to dapp globals.css
$dappCssPath = "$dir\dapp\styles\globals.css"
if (Test-Path $dappCssPath) {
    $content = [System.IO.File]::ReadAllText($dappCssPath, [System.Text.Encoding]::UTF8)
    if ($content -notmatch "BASE DESIGN OVERRIDES") {
        $content += "`n" + $cssBlock
        [System.IO.File]::WriteAllText($dappCssPath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Injected global overrides into globals.css"
    }
}

# Apply to waitlist inline style
$waitlistPath = "$dir\waitlist.html"
if (Test-Path $waitlistPath) {
    $content = [System.IO.File]::ReadAllText($waitlistPath, [System.Text.Encoding]::UTF8)
    if ($content -notmatch "BASE DESIGN OVERRIDES") {
        $content = [regex]::Replace($content, "</style>", "$cssBlock`n</style>")
        [System.IO.File]::WriteAllText($waitlistPath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Injected global overrides into waitlist.html"
    }
}

# Apply copyright and taglines to all HTML files
$extensions = @("*.html")
$files = Get-ChildItem -Path $dir -Include $extensions -Recurse | Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" }

foreach ($f in $files) {
    if (Test-Path $f.FullName) {
        $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        $orig = $content
        
        # Copyright
        $content = [regex]::Replace($content, '(\u00A9|Copyright)\s*(?:\(c\))?\s*202\d\s*(?:Base|AequitasLabs|Aequitas)\.?', '© 2026 Base. All rights reserved.')
        
        # Ensure Alert toast works
        $content = [regex]::Replace($content, 'alert\(', 'showToast(')

        if ($content -cne $orig) {
            [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Updated semantic blocks in $($f.Name)"
        }
    }
}

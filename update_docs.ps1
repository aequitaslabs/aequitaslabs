$path = "c:\Users\perpl\aequitaslabs-new\docs.html"
$content = [System.IO.File]::ReadAllText($path)

# 1. CSS Updates
$cssAdditions = @"
/* NEW GENERATED STYLES */
.prim-page{display:block; padding-top:40px; margin-top:-40px; border-top:1px solid transparent;}

code:not(pre code) {
  font-family:'DM Mono',monospace;font-size:12px;
  color:#FFCD4A !important;
  background:rgba(201,168,76,0.15) !important;
  padding:3px 6px;border-radius:6px;
}
.badge-enforced { background: rgba(255,80,80,0.12); color: #ff8080; border-color: rgba(255,80,80,0.3); }
.badge-configurable { background: rgba(80,200,255,0.1); color: #80cfff; border-color: rgba(80,200,255,0.2); }

.table-header {
  display:grid; grid-template-columns:150px 80px 1fr; 
  padding:10px 14px; font-family:'DM Mono',monospace; font-size:11px; 
  text-transform:uppercase; color:var(--text-4); letter-spacing:0.1em; 
  border-bottom:1px solid var(--rim); margin-bottom:4px;
}
.inputs-table .table-header { grid-template-columns:160px 1fr 70px; }
.failure-table .table-header { grid-template-columns:160px 1fr; gap:14px; }

.outputs-table .output-row:nth-child(even), 
.inputs-table .input-row:nth-child(even),
.failure-table .failure-row:nth-child(even) {
  background: rgba(255,255,255,0.03);
}

.sb-search { padding: 0 24px 20px; }
.sb-search input { width:100%; background:rgba(0,0,0,0.5); border:1px solid var(--rim); border-radius:6px; padding:8px 12px 8px 30px; color:var(--text-1); font-family:'DM Mono',monospace; font-size:12px; outline:none; transition:border-color 0.2s;}
.sb-search input:focus { border-color:rgba(201,168,76,0.5); }
.sb-search svg { position:absolute; left:10px; top:50%; transform:translateY(-50%); width:14px; height:14px; color:var(--text-4); }
"@

$content = $content -replace "\.prim-page\{display:none;\}", ""
$content = $content -replace "\.prim-page\.active\{display:block;\}", ""
$content = $content -replace "\.code-block\{\s*background:rgba\(0,0,0,0\.4\);", ".code-block{`n  background:#0A0908;"
$content = $content -replace "</style>", "$cssAdditions`n</style>"

# 2. Search Box Injection
$searchHtml = @"
<div class="sb-search">
  <div style="position:relative;">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="text" id="docs-search" placeholder="Search primitives..." oninput="searchDocs(this.value)">
  </div>
</div>
"@
$content = $content -replace "<div class=`"sb-section`">\s*<div class=`"sb-section-label`">Getting Started</div>", "$searchHtml`n    <div class=`"sb-section`">`n      <div class=`"sb-section-label`">Getting Started</div>"


# 3. Badges (enforced / configurable)
$content = $content -replace "<div class=`"input-badge badge-req`">enforced</div>", "<div class=`"input-badge badge-enforced`">enforced</div>"
$content = $content -replace "<div class=`"input-badge badge-opt`">configurable</div>", "<div class=`"input-badge badge-configurable`">configurable</div>"

# 4. SKILL.md styling headers
$skillHeader = @"
<span style="display:flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;color:var(--text-1);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> SKILL.md</span>
"@
$content = $content -replace "<div class=`"cb-title`">SKILL\.md Â· frontmatter</div>", "<div class=`"cb-title`">$skillHeader</div>"


# 5. JS Update
$jsAdditions = @"
function searchDocs(val) {
  val = val.toLowerCase();
  document.querySelectorAll('.sb-item').forEach(item => {
    if(item.innerText.toLowerCase().includes(val)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Line Numbers via JS
document.querySelectorAll('pre').forEach(pre => {
  const codeBlock = pre.closest('.code-block');
  if(!codeBlock) return;
  const blockTitle = codeBlock.querySelector('.cb-title');
  if(blockTitle && blockTitle.innerText.toLowerCase().includes('workflow')) return; // preserve manual numbering

  const lines = pre.innerHTML.split('\n');
  if(lines[lines.length-1].trim() === '') lines.pop(); // remove trailing empty line

  pre.innerHTML = lines.map((l, i) => {
    let n = (i+1).toString().padStart(2, '0');
    return `<span class="line-num" style="display:inline-block; width:24px; color:var(--text-4); user-select:none; margin-right:12px;">\${n}</span><span>\${l}</span>`;
  }).join('\n');
});

// Dynamic Table Headers
document.querySelectorAll('.inputs-table').forEach(tbl => {
  const header = document.createElement('div');
  header.className = 'table-header';
  header.innerHTML = '<div>Parameter</div><div>Description</div><div>Requirements</div>';
  tbl.insertBefore(header, tbl.firstChild);
});

document.querySelectorAll('.outputs-table').forEach(tbl => {
  const header = document.createElement('div');
  header.className = 'table-header';
  if(tbl.closest('#page-skill') && tbl.previousElementSibling.innerText.includes('Available Actions')) {
    header.innerHTML = '<div>Action</div><div>Category</div><div>Description</div>';
  } else if (tbl.closest('#page-skill') && tbl.previousElementSibling.innerText.includes('Agent Roles')) {
    header.innerHTML = '<div>Role</div><div>Type</div><div>Description</div>';
  } else {
    header.innerHTML = '<div>Variable</div><div>Type</div><div>Description</div>';
  }
  tbl.insertBefore(header, tbl.firstChild);
});

document.querySelectorAll('.failure-table').forEach(tbl => {
  const header = document.createElement('div');
  header.className = 'table-header';
  if(tbl.closest('#page-skill') && tbl.previousElementSibling.innerText.includes('Execution Rules')) {
    header.innerHTML = '<div>Rule</div><div>Guideline</div>';
  } else {
    header.innerHTML = '<div>Failure Code</div><div>Mitigation Strategy</div>';
  }
  tbl.insertBefore(header, tbl.firstChild);
});

// Update showPage logic for anchors
window.showPage = function(id, sidebarItem) {
  const sb = document.querySelector('.sidebar');
  if(sb && sb.classList.contains('open')) sb.classList.remove('open');
  
  const target = document.getElementById('page-' + id);
  if(target) {
     const yOffset = -60;
     const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
     window.scrollTo({top: y, behavior: 'smooth'});
  }
};

// Scroll active state highlighting
const pages = ['overview', 'deploy', 'execute', 'verify', 'settle', 'skill'];
window.addEventListener('scroll', () => {
  let current = '';
  // Find the closest active section
  for(let i = pages.length-1; i >= 0; i--) {
     const el = document.getElementById('page-' + pages[i]);
     if(el && el.getBoundingClientRect().top <= 200) {
        current = pages[i];
        break;
     }
  }
  
  if(current) {
    document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
    const map = {overview:0, deploy:1, execute:2, verify:3, settle:4, skill:5};
    const items = document.querySelectorAll('.sb-item');
    if(items[map[current]]) items[map[current]].classList.add('active');
  }
});
"@

$oldShowPagePattern = "(?s)function showPage\(id, sidebarItem\) \{.*?\n\}"
$content = $content -replace $oldShowPagePattern, ""

$oldCopyPre = "(?s)function copyPre\(btn\) \{.*?\n\}"
$newCopyPre = @"
function copyPre(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  let text = '';
  const clone = pre.cloneNode(true);
  clone.querySelectorAll('.line-num').forEach(e => e.remove());
  text = clone.innerText;
  
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
  });
}
"@
$content = $content -replace $oldCopyPre, ""

$content = $content -replace "</script>", "$jsAdditions`n`n$newCopyPre`n</script>"

# Use UTF-8 strictly without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)

Write-Host "Updated docs.html"

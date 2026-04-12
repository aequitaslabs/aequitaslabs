const fs = require('fs');
const path = require('path');

const DIR = 'c:\\Users\\perpl\\base-new';

function processFile(filepath) {
    if (!filepath.match(/\.(html|js|css|ts|tsx|json|md|txt)$/)) return;

    let original;
    try {
        original = fs.readFileSync(filepath, 'utf8');
    } catch (e) {
        return;
    }

    let content = original;

    // 1. Standardize Title and og tags
    content = content.replace(/<title>Base | Autonomous Capital on Base</title>');
    content = content.replace(/<meta property="og:title" content="Base" />');
    content = content.replace(/<meta property="og:site_name" content="Base" />');

    // 2. Logo replacements in HTML
    const logoInner = `<div class="logo-name" style="font-family: 'Coinbase Display', 'Inter', sans-serif; font-size: 24px; font-weight: 700; color: #0052FF; letter-spacing: -0.02em;">Base</div>`;
    content = content.replace(/<div class="logo-mark">.*?<\/div>\s*<div class="logo-wordmark">.*?<\/div>/gis, logoInner);
    content = content.replace(/<img[^>]*src="[^"]*base-pfp-400x400\.png"[^>]*>/gi, '');

    // 3. Text Replacements
    content = content.replace(/Base/g, 'Base');
    content = content.replace(/Base/g, 'Base');
    content = content.replace(/base/g, 'base');
    content = content.replace(/Base/g, 'Base');
    content = content.replace(/base/g, 'base');
    content = content.replace(/BASE/g, 'BASE');

    if (original !== content) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('Updated', filepath);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fullPath.includes('.git') || fullPath.includes('node_modules') || fullPath.includes('.next')) continue;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

walk(DIR);
console.log('Done');

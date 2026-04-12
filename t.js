const fs = require('fs');
const path = require('path');

const directory = 'c:\\Users\\perpl\\base-new';

const logoPattern = /<span style="color:#0052FF;font-weight:800">Base</span>';

const faviconPattern = /<link rel="icon" type="image\/svg\+xml" href="data:image\/svg\+xml,[^"]*"\/>/g;
const newFavicon = '<link rel="icon" type="image/png" href="assets/base-pfp-400x400.png"/>';
const newFaviconAbs = '<link rel="icon" type="image/png" href="https://base.xyz/assets/base-pfp-400x400.png"/>';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('.git') && !file.includes('node_modules')) {
                results = results.concat(walkDir(file));
            }
        } else {
            if (file.endsWith('.html') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir(directory);
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    let isDapp = file.includes('dapp') || file.includes('dapp\\pages');

    if (!isDapp) {
        content = content.replace(logoPattern, newLogo);
        content = content.replace(faviconPattern, newFavicon);
    } else {
        content = content.replace(faviconPattern, newFaviconAbs);
        const dummyLogoPattern = /<div style={{ width: '24px', height: '24px', border: '1px solid #C9A84C[\s\S]*?<\/div\s*>\n\s*<\/div>/g;
        // Wait, the dummy logo actually has an inner div too:
        //           <div style={{ width: '24px', height: '24px', border: '1px solid #C9A84C', ... }}>
        //             <div style={{ width: '8px', height: '8px', background: '#C9A84C', ... }}></div>
        //           </div>
        const dummyLogoPatt2 = /<div style={{ width: '24px', height: '24px', border: '1px solid #C9A84C[\s\S]{1,300}?<\/div>/g;
        content = content.replace(dummyLogoPatt2, '');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
    }
});

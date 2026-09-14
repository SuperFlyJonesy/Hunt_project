import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Remove button tags
    content = content.replace(/<button\s+id=["']dev-reset["'][^>]*>[\s\S]*?<\/button>/gi, '');

    // Remove single line CSS rules for #dev-reset
    content = content.replace(/#dev-reset\s*\{[^}]*\}/gi, '');
    content = content.replace(/#dev-reset:hover\s*\{[^}]*\}/gi, '');

    // Remove multi-line CSS rules for #dev-reset
    content = content.replace(/#dev-reset\s*\{[\s\S]*?\}/gi, '');
    content = content.replace(/#dev-reset:hover\s*\{[\s\S]*?\}/gi, '');

    // Remove any JS event listener references to dev-reset
    content = content.replace(/document\.getElementById\(['"]dev-reset['"]\)\s*\.addEventListener\([\s\S]*?\n\s*\}\);/gi, '');
    content = content.replace(/const\s+devResetBtn\s*=\s*document\.getElementById\(['"]dev-reset['"]\);/gi, '');
    content = content.replace(/if\s*\(\s*devResetBtn\s*\)\s*\{[\s\S]*?\}/gi, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned dev-reset from: ${path.relative(rootDir, filePath)}`);
        return true;
    }
    return false;
}

function walkDir(dir, filterFn) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === '.astro' || file === 'dist' || file === '.gemini') continue;
            walkDir(fullPath, filterFn);
        } else if (filterFn(fullPath)) {
            cleanFile(fullPath);
        }
    }
}

console.log('--- Cleaning Astro pages ---');
walkDir(path.join(rootDir, 'src'), f => f.endsWith('.astro') || f.endsWith('.js') || f.endsWith('.css'));

console.log('--- Cleaning root HTML & JS & CSS files ---');
const rootFiles = fs.readdirSync(rootDir);
for (const f of rootFiles) {
    const p = path.join(rootDir, f);
    if (fs.statSync(p).isFile() && (f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.css'))) {
        cleanFile(p);
    }
}

console.log('--- Cleaning styles directory ---');
if (fs.existsSync(path.join(rootDir, 'styles'))) {
    walkDir(path.join(rootDir, 'styles'), f => f.endsWith('.css'));
}

console.log('Dev reset cleaning finished.');

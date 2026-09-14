import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const archiveDir = path.join(rootDir, 'archive', 'legacy_html');

if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
}

const rootFiles = fs.readdirSync(rootDir);
const htmlFiles = rootFiles.filter(f => f.endsWith('.html'));

console.log(`Found ${htmlFiles.length} root HTML files to archive.`);

for (const file of htmlFiles) {
    const src = path.join(rootDir, file);
    const dest = path.join(archiveDir, file);
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
    console.log(`Archived: ${file} -> archive/legacy_html/${file}`);
}

const readmeContent = `# Legacy Static HTML Archive

This directory contains historical standalone static HTML pages preserved prior to the full migration and streamlining of the Hunt Hearing Loss Initiative project to Astro SSG.

## Canonical Source of Truth
The canonical source of truth for all pages is located in:
- \`src/pages/*.astro\` (Astro Components)
- \`dist/\` (Compiled Production Build Output)

Archived on: ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(archiveDir, 'ARCHIVE_README.md'), readmeContent, 'utf8');
console.log('Archive completed successfully with ARCHIVE_README.md.');

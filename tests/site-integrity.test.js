import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function getHtmlFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHtmlFiles(fullPath));
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

const htmlFiles = getHtmlFiles(distDir);

describe('Site Integrity & Quality Assurance', () => {
    it('1. All HTML pages have valid DOCTYPE, html lang, head, and title tags', () => {
        assert.ok(htmlFiles.length > 0, 'Must have built HTML files in dist/');
        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            assert.ok(content.toLowerCase().includes('<!doctype html>'), `${path.basename(file)} is missing <!DOCTYPE html>`);
            assert.ok(content.includes('<html lang='), `${path.basename(file)} is missing <html lang=...>`);
            assert.ok(content.includes('<title>'), `${path.basename(file)} is missing <title> tag`);
        }
    });

    it('2. All HTML pages have a mobile-responsive viewport meta tag', () => {
        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            assert.ok(
                content.includes('name="viewport"') || content.includes("name='viewport'"),
                `${path.basename(file)} is missing responsive viewport meta tag`
            );
        }
    });

    it('3. All local images referenced in HTML files exist on disk (zero broken images)', () => {
        const brokenImages = [];
        const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;

        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            let match;
            while ((match = imgRegex.exec(content)) !== null) {
                const src = match[1];
                if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
                    continue;
                }
                const cleanSrc = src.split('?')[0].split('#')[0].replace(/^\//, '');
                const decodedSrc = decodeURIComponent(cleanSrc);
                
                const pDist = path.join(distDir, cleanSrc);
                const pDistDecoded = path.join(distDir, decodedSrc);
                const pPublic = path.join(rootDir, 'public', cleanSrc);
                const pPublicDecoded = path.join(rootDir, 'public', decodedSrc);
                const pRoot = path.join(rootDir, cleanSrc);
                const pRootDecoded = path.join(rootDir, decodedSrc);

                if (!fs.existsSync(pDist) && !fs.existsSync(pDistDecoded) &&
                    !fs.existsSync(pPublic) && !fs.existsSync(pPublicDecoded) &&
                    !fs.existsSync(pRoot) && !fs.existsSync(pRootDecoded)) {
                    brokenImages.push({ file: path.relative(distDir, file), src });
                }
            }
        }

        assert.strictEqual(
            brokenImages.length,
            0,
            `Found ${brokenImages.length} broken image references: ${JSON.stringify(brokenImages, null, 2)}`
        );
    });

    it('4. All images across all pages have non-empty accessible alt attributes', () => {
        const missingAlts = [];
        const imgRegex = /<img\s+([^>]*?)>/gi;

        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            let match;
            while ((match = imgRegex.exec(content)) !== null) {
                const attrs = match[1];
                const altMatch = /alt=["'](.*?)["']/i.exec(attrs);
                if (!altMatch || altMatch[1].trim().length === 0) {
                    missingAlts.push({ file: path.relative(distDir, file), tag: match[0] });
                }
            }
        }

        assert.strictEqual(
            missingAlts.length,
            0,
            `Found ${missingAlts.length} images with missing or empty alt tags: ${JSON.stringify(missingAlts, null, 2)}`
        );
    });

    it('5. Service Worker CORE_ASSETS exist on disk', () => {
        const swContent = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf-8');
        const assetBlockMatch = /const\s+CORE_ASSETS\s*=\s*\[([\s\S]*?)\];/.exec(swContent);
        assert.ok(assetBlockMatch, 'Could not find CORE_ASSETS array in sw.js');

        const rawEntries = assetBlockMatch[1]
            .split(',')
            .map(s => s.trim().replace(/['"]/g, ''))
            .filter(Boolean);

        const missing = [];
        for (const entry of rawEntries) {
            if (entry === './' || entry === '/') continue;
            const clean = entry.replace(/^\.\//, '').replace(/^\//, '').split('?')[0];
            const decoded = decodeURIComponent(clean);
            
            const inDist = fs.existsSync(path.join(distDir, clean)) || fs.existsSync(path.join(distDir, decoded));
            const inPublic = fs.existsSync(path.join(rootDir, 'public', clean)) || fs.existsSync(path.join(rootDir, 'public', decoded));
            const inRoot = fs.existsSync(path.join(rootDir, clean)) || fs.existsSync(path.join(rootDir, decoded));

            if (!inDist && !inPublic && !inRoot) {
                missing.push(entry);
            }
        }

        assert.strictEqual(
            missing.length,
            0,
            `Service worker references non-existent assets: ${JSON.stringify(missing)}`
        );
    });

    it('6. All pages linking styles.css and script.js use synchronized links', () => {
        const missingStyles = [];
        const missingScripts = [];

        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            
            // Check styles.css
            const hasStyles = /href=["'][^"']*styles\.css(?:\?[^"']*)?["']/i.test(content);
            if (!hasStyles) {
                missingStyles.push(path.relative(distDir, file));
            }

            // Check script.js
            const hasScript = /src=["'][^"']*script\.js(?:\?[^"']*)?["']/i.test(content);
            if (!hasScript) {
                missingScripts.push(path.relative(distDir, file));
            }
        }

        assert.strictEqual(
            missingStyles.length,
            0,
            `Pages missing styles.css: ${JSON.stringify(missingStyles)}`
        );
        assert.strictEqual(
            missingScripts.length,
            0,
            `Pages missing script.js: ${JSON.stringify(missingScripts)}`
        );
    });
});

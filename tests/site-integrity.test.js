import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

describe('Site Integrity & Quality Assurance', () => {
    it('1. All HTML pages have valid DOCTYPE, html lang, head, and title tags', () => {
        for (const file of htmlFiles) {
            const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
            assert.ok(content.toLowerCase().includes('<!doctype html>'), `${file} is missing <!DOCTYPE html>`);
            assert.ok(content.includes('<html lang='), `${file} is missing <html lang=...>`);
            assert.ok(content.includes('<title>'), `${file} is missing <title> tag`);
        }
    });

    it('2. All HTML pages have a mobile-responsive viewport meta tag', () => {
        for (const file of htmlFiles) {
            const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
            assert.ok(
                content.includes('name="viewport"') || content.includes("name='viewport'"),
                `${file} is missing responsive viewport meta tag`
            );
        }
    });

    it('3. All local images referenced in HTML files exist on disk (zero broken images)', () => {
        const brokenImages = [];
        const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;

        for (const file of htmlFiles) {
            const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
            let match;
            while ((match = imgRegex.exec(content)) !== null) {
                const src = match[1];
                if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
                    continue;
                }
                const cleanSrc = src.split('?')[0].split('#')[0];
                const decodedSrc = decodeURIComponent(cleanSrc);
                const p1 = path.join(rootDir, cleanSrc);
                const p2 = path.join(rootDir, decodedSrc);

                if (!fs.existsSync(p1) && !fs.existsSync(p2)) {
                    brokenImages.push({ file, src });
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
            const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
            let match;
            while ((match = imgRegex.exec(content)) !== null) {
                const attrs = match[1];
                const altMatch = /alt=["'](.*?)["']/i.exec(attrs);
                if (!altMatch || altMatch[1].trim().length === 0) {
                    missingAlts.push({ file, tag: match[0] });
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
            const clean = entry.replace(/^\.\//, '').split('?')[0];
            const decoded = decodeURIComponent(clean);
            if (!fs.existsSync(path.join(rootDir, clean)) && !fs.existsSync(path.join(rootDir, decoded))) {
                missing.push(entry);
            }
        }

        assert.strictEqual(
            missing.length,
            0,
            `Service worker references non-existent assets: ${JSON.stringify(missing)}`
        );
    });

    it('6. All pages linking styles.css and script.js use synchronized version queries', () => {
        const mismatchedStyles = [];
        const mismatchedScripts = [];

        for (const file of htmlFiles) {
            const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
            
            // Check styles.css
            const styleMatches = content.match(/href=["']styles\.css(?:\?v=[^"']*)?["']/g);
            if (styleMatches) {
                for (const m of styleMatches) {
                    if (!m.includes('v=31.0')) {
                        mismatchedStyles.push({ file, match: m });
                    }
                }
            }

            // Check script.js
            const scriptMatches = content.match(/src=["']script\.js(?:\?v=[^"']*)?["']/g);
            if (scriptMatches) {
                for (const m of scriptMatches) {
                    if (!m.includes('v=36.0')) {
                        mismatchedScripts.push({ file, match: m });
                    }
                }
            }
        }

        assert.strictEqual(
            mismatchedStyles.length,
            0,
            `Found mismatched styles.css versions: ${JSON.stringify(mismatchedStyles)}`
        );
        assert.strictEqual(
            mismatchedScripts.length,
            0,
            `Found mismatched script.js versions: ${JSON.stringify(mismatchedScripts)}`
        );
    });
});

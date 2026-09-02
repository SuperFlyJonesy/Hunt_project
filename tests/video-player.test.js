import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('c:/Users/BettyBoo/Projects/Hunt_project');

test('Global "It Goes To 11" Video Player Standard', async (t) => {
    const htmlFiles = fs.readdirSync(projectRoot)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(projectRoot, f));

    await t.test('1. Zero raw inline <iframe> embeds remain across the site', () => {
        const filesWithRawIframes = [];
        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf8');
            if (/<iframe\s/i.test(content)) {
                filesWithRawIframes.push(path.basename(file));
            }
        }
        assert.deepStrictEqual(filesWithRawIframes, [], `Expected 0 raw iframes, found in: ${filesWithRawIframes.join(', ')}`);
    });

    await t.test('2. All video-link-item elements have valid video IDs and preview cards', () => {
        let totalVideoItems = 0;
        const invalidItems = [];

        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf8');
            const items = content.match(/<div[^>]*class="[^"]*video-link-item[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g) || [];

            for (const item of items) {
                totalVideoItems++;
                const idMatch = item.match(/data-video-id="([\w-]{11})"/);
                const hasPreviewCard = item.includes('video-preview-card');
                const hasThumb = item.includes('preview-thumb') || item.includes('background: url');
                const hasTitle = item.includes('preview-title') || item.includes('Watch On-Site');

                if (!idMatch || !hasPreviewCard || !hasThumb || !hasTitle) {
                    invalidItems.push({
                        file: path.basename(file),
                        snippet: item.substring(0, 100)
                    });
                }
            }
        }

        assert.ok(totalVideoItems >= 10, `Expected at least 10 video items across site, found ${totalVideoItems}`);
        assert.deepStrictEqual(invalidItems, [], `Found invalid video items: ${JSON.stringify(invalidItems, null, 2)}`);
    });

    await t.test('3. Modal player engine in script.js has required functions and close handling', () => {
        const scriptContent = fs.readFileSync(path.join(projectRoot, 'script.js'), 'utf8');
        assert.ok(scriptContent.includes('function openVideoModal('), 'script.js must contain openVideoModal');
        assert.ok(scriptContent.includes('function closeVideoModal('), 'script.js must contain closeVideoModal');
        assert.ok(scriptContent.includes('function initOnSiteVideoPlayer('), 'script.js must contain initOnSiteVideoPlayer');
        assert.ok(scriptContent.includes('hli-video-modal-close-btn'), 'script.js must wire up close button');
        assert.ok(scriptContent.includes('youtube-nocookie.com/embed/'), 'script.js must use youtube-nocookie.com');
    });

    await t.test('4. path-it-goes-to-11.html maintains its 5 signature videos', () => {
        const content = fs.readFileSync(path.join(projectRoot, 'path-it-goes-to-11.html'), 'utf8');
        const expectedIds = ['KOO5S4vxi0o', 'OAhTI4AltXE', 'i-mwl_K-pFA', '7my5baoCVv8', 'mKrWFkAuvOA'];
        for (const id of expectedIds) {
            assert.ok(content.includes(id), `path-it-goes-to-11.html must retain video ${id}`);
        }
    });

    await t.test('5. styles.css defines standard preview card and modal classes', () => {
        const css = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
        assert.ok(css.includes('.video-preview-card'), 'styles.css must define .video-preview-card');
        assert.ok(css.includes('.preview-thumb'), 'styles.css must define .preview-thumb');
        assert.ok(css.includes('.preview-title'), 'styles.css must define .preview-title');
        assert.ok(css.includes('.hli-video-modal-backdrop'), 'styles.css must define .hli-video-modal-backdrop');
        assert.ok(css.includes('.hli-video-modal-close-btn'), 'styles.css must define .hli-video-modal-close-btn');
    });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('c:/Users/BettyBoo/Projects/Hunt_project');

test('Landing Page Video Sizing & Mask Coverage Optimization', async (t) => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
    const script = fs.readFileSync(path.join(projectRoot, 'script.js'), 'utf8');
    const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

    await t.test('1. index.html contains bg-video and stencil-svg-text', () => {
        assert.ok(indexHtml.includes('id="bg-video"'), 'index.html must have #bg-video');
        assert.ok(indexHtml.includes('class="video-mask-container"'), 'index.html must have .video-mask-container');
        assert.ok(indexHtml.includes('id="stencil-svg-text"'), 'index.html must have #stencil-svg-text');
        assert.ok(indexHtml.includes('id="stencil-mask-svg"'), 'index.html must have #stencil-mask-svg');
    });

    await t.test('2. styles.css optimizes video size and centers on number mask', () => {
        assert.ok(css.includes('.video-mask-container video'), 'styles.css must target .video-mask-container video');
        assert.ok(css.includes('top: 38vh;'), 'desktop video must be centered at 38vh matching number mask');
        assert.ok(css.includes('top: 26vh;'), 'mobile video must be centered at 26vh matching mobile number mask');
        assert.ok(!css.includes('.video-mask-container video {\n    width: 100%;\n    height: 100%;'), 'video must not stretch to 100% full screen');
    });

    await t.test('3. script.js has syncVideoToMask engine with safety overhang padding', () => {
        assert.ok(script.includes('function syncVideoToMask()'), 'script.js must contain syncVideoToMask');
        assert.ok(script.includes('getBoundingClientRect()'), 'syncVideoToMask must measure mask bounding box');
        assert.ok(script.includes('rect.width * 0.25') || script.includes('padX'), 'syncVideoToMask must calculate safety overhang width');
        assert.ok(script.includes('rect.height * 0.35') || script.includes('padY'), 'syncVideoToMask must calculate safety overhang height');
        assert.ok(script.includes('window.addEventListener(\'resize\', syncVideoToMask'), 'syncVideoToMask must listen to resize');
        assert.ok(script.includes('window.__hliSyncVideoToMask'), 'syncVideoToMask must sync on prologue dismiss');
    });
});

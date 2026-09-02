import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('c:/Users/BettyBoo/Projects/Hunt_project');

test('Landing Page Video Sizing & Dynamic Mask Coverage (Zero Black Borders)', async (t) => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
    const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

    await t.test('1. index.html contains bg-video and stencil-svg-text in proper structure', () => {
        assert.ok(indexHtml.includes('id="bg-video"'), 'index.html must have #bg-video');
        assert.ok(indexHtml.includes('class="video-mask-container"'), 'index.html must have .video-mask-container');
        assert.ok(indexHtml.includes('id="stencil-svg-text"'), 'index.html must have #stencil-svg-text');
        assert.ok(indexHtml.includes('id="stencil-mask-svg"'), 'index.html must have #stencil-mask-svg');
    });

    await t.test('2. styles.css ensures full dynamic coverage with zero black borders under mask', () => {
        const videoRuleMatch = css.match(/\.video-mask-container\s+video\s*\{([^}]+)\}/);
        assert.ok(videoRuleMatch, 'styles.css must define .video-mask-container video rule block');
        const videoRules = videoRuleMatch[1];
        assert.ok(videoRules.includes('width: 100%'), 'video must dynamically fill container width');
        assert.ok(videoRules.includes('height: 100%'), 'video must dynamically fill container height');
        assert.ok(videoRules.includes('object-fit: cover'), 'video must use object-fit cover to eliminate black borders');
        assert.ok(!videoRules.includes('max-width'), 'video must not have max-width clamp');
        assert.ok(!videoRules.includes('height: 48vh'), 'video must not have 48vh clamp');
    });

    await t.test('3. styles.css enhances video rendering contrast and saturation', () => {
        assert.ok(css.includes('filter: contrast('), 'video must have contrast enhancement filter');
        assert.ok(css.includes('saturate('), 'video must have saturation enhancement filter');
    });
});

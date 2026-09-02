import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Scroll Controls & Floating Back to Top Button', () => {
    const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf-8');
    const scriptJs = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf-8');

    it('1. styles.css positions .floating-scroll-controls at right side middle on all displays', () => {
        assert.ok(stylesCss.includes('.floating-scroll-controls'), 'styles.css must style .floating-scroll-controls');
        assert.ok(stylesCss.includes('right: 20px'), 'Should anchor to right: 20px on desktop');
        assert.ok(stylesCss.includes('top: 50%'), 'Should be vertically centered at top: 50%');
        assert.ok(stylesCss.includes('transform: translateY(-50%)'), 'Centered with translateY(-50%)');
        assert.ok(stylesCss.includes('right: 12px'), 'Should have mobile anchor right: 12px');
    });

    it('2. styles.css positions .hli-back-to-top-btn at top left on desktop and mobile', () => {
        assert.ok(stylesCss.includes('.hli-back-to-top-btn'), 'styles.css must style .hli-back-to-top-btn');
        assert.ok(stylesCss.includes('top: 20px'), 'Top left desktop anchor');
        assert.ok(stylesCss.includes('left: 20px'), 'Left desktop anchor');
        assert.ok(stylesCss.includes('top: 14px'), 'Top left mobile anchor');
        assert.ok(stylesCss.includes('left: 14px'), 'Left mobile anchor');
    });

    it('3. script.js defines and initializes initFloatingScrollControls with both up and down arrows', () => {
        assert.ok(scriptJs.includes('function initFloatingScrollControls()'), 'Must define initFloatingScrollControls');
        assert.ok(scriptJs.includes('id = \'scroll-up-btn\''), 'Creates scroll-up-btn');
        assert.ok(scriptJs.includes('id = \'scroll-down-btn\''), 'Creates scroll-down-btn');
        assert.ok(scriptJs.includes('polyline points="18 15 12 9 6 15"'), 'Contains up arrow SVG');
        assert.ok(scriptJs.includes('polyline points="6 9 12 15 18 9"'), 'Contains down arrow SVG');
    });

    it('4. script.js defines and initializes initBackToTopButton on long pages', () => {
        assert.ok(scriptJs.includes('function initBackToTopButton()'), 'Must define initBackToTopButton');
        assert.ok(scriptJs.includes('id = \'hli-back-to-top\''), 'Creates hli-back-to-top button');
        assert.ok(scriptJs.includes('isLongPage'), 'Detects when text on page gets too long');
        assert.ok(scriptJs.includes('window.scrollTo({ top: 0, behavior: \'smooth\' })'), 'Smoothly scrolls to top');
    });

    it('5. Neither component is blocked globally by display: none !important', () => {
        assert.strictEqual(stylesCss.includes('.floating-scroll-controls {\n    display: none !important;'), false);
        assert.strictEqual(stylesCss.includes('.hli-back-to-top-btn {\n    display: none !important;'), false);
    });

    it('6. path-it-goes-to-11 specifically excludes the scroll arrows', () => {
        assert.ok(scriptJs.includes("path.includes('path-it-goes-to-11')"), 'script.js skips scroll arrows on path-it-goes-to-11');
        assert.ok(stylesCss.includes('body.spinal-tap-theme .floating-scroll-controls'), 'styles.css suppresses scroll controls for spinal-tap-theme');
    });
});

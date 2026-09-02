import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Subtle Premium Color Distinction (Yes Path vs Support Path)', () => {
    const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf-8');
    const scriptJs = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf-8');
    const pathYesHtml = fs.readFileSync(path.join(rootDir, 'path-yes.html'), 'utf-8');
    const pathSupportHtml = fs.readFileSync(path.join(rootDir, 'path-support.html'), 'utf-8');
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

    it('1. styles.css defines subtle sapphire styling for path-yes-page and rose styling for path-support-page', () => {
        assert.ok(stylesCss.includes('body.path-yes-page'), 'styles.css must define body.path-yes-page');
        assert.ok(stylesCss.includes('body.path-support-page'), 'styles.css must define body.path-support-page');
        assert.ok(stylesCss.includes('.hub-subtitle.subtitle-yes'), 'styles.css must style subtitle-yes');
        assert.ok(stylesCss.includes('.hub-subtitle.subtitle-support'), 'styles.css must style subtitle-support');
        assert.ok(stylesCss.includes('.pathway-subheading-dot'), 'styles.css must style pathway-subheading-dot');
    });

    it('2. path-yes.html incorporates the dot and line in the subheading only', () => {
        assert.ok(pathYesHtml.includes('class="premium-white-theme path-yes-page"'), 'path-yes.html must have path-yes-page class on body');
        assert.ok(pathYesHtml.includes('class="hub-subtitle subtitle-yes"'), 'path-yes.html must have subtitle-yes class on subheading');
        assert.ok(pathYesHtml.includes('pathway-subheading-dot'), 'path-yes.html subheading must contain pathway-subheading-dot');
        assert.ok(!pathYesHtml.includes('pathway-heading-dot'), 'path-yes.html heading must not contain dot');
        assert.ok(!pathYesHtml.includes('pathway-indicator-pill'), 'path-yes.html must not contain separate pathway-indicator-pill');
    });

    it('3. path-support.html incorporates the dot and line in the subheading only', () => {
        assert.ok(pathSupportHtml.includes('class="premium-white-theme path-support-page"'), 'path-support.html must have path-support-page class on body');
        assert.ok(pathSupportHtml.includes('class="hub-subtitle subtitle-support"'), 'path-support.html must have subtitle-support class on subheading');
        assert.ok(pathSupportHtml.includes('pathway-subheading-dot'), 'path-support.html subheading must contain pathway-subheading-dot');
        assert.ok(!pathSupportHtml.includes('pathway-heading-dot'), 'path-support.html heading must not contain dot');
        assert.ok(!pathSupportHtml.includes('pathway-indicator-pill'), 'path-support.html must not contain separate pathway-indicator-pill');
    });

    it('4. script.js dynamically ensures path-yes-page and path-support-page classes on load', () => {
        assert.ok(scriptJs.includes('function initMainPathwayThemes()'), 'script.js must define initMainPathwayThemes');
        assert.ok(scriptJs.includes('path-yes-page'), 'script.js must add path-yes-page');
        assert.ok(scriptJs.includes('path-support-page'), 'script.js must add path-support-page');
        assert.ok(scriptJs.includes('initMainPathwayThemes();'), 'script.js must initialize main pathway themes');
    });

    it('5. index.html differentiates the two path choices with subtle colored card styling', () => {
        assert.ok(indexHtml.includes('pathway-yes'), 'index.html must have pathway-yes card');
        assert.ok(indexHtml.includes('pathway-support'), 'index.html must have pathway-support card');
        assert.ok(stylesCss.includes('.pathway.pathway-yes'), 'styles.css must style pathway.pathway-yes');
        assert.ok(stylesCss.includes('.pathway.pathway-support'), 'styles.css must style pathway.pathway-support');
    });
});

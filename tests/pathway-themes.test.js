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

    const getPageContent = (name) => {
        const distPath = path.join(rootDir, 'dist', name, 'index.html');
        const astroPath = path.join(rootDir, 'src', 'pages', `${name}.astro`);
        if (fs.existsSync(distPath)) return fs.readFileSync(distPath, 'utf-8');
        if (fs.existsSync(astroPath)) return fs.readFileSync(astroPath, 'utf-8');
        return '';
    };

    const pathYesHtml = getPageContent('path-yes');
    const pathSupportHtml = getPageContent('path-support');
    const indexHtml = fs.existsSync(path.join(rootDir, 'dist', 'index.html'))
        ? fs.readFileSync(path.join(rootDir, 'dist', 'index.html'), 'utf-8')
        : fs.readFileSync(path.join(rootDir, 'src', 'pages', 'index.astro'), 'utf-8');

    it('1. styles.css defines subtle sapphire styling for path-yes-page and rose styling for path-support-page', () => {
        assert.ok(stylesCss.includes('body.path-yes-page'), 'styles.css must define body.path-yes-page');
        assert.ok(stylesCss.includes('body.path-support-page'), 'styles.css must define body.path-support-page');
        assert.ok(stylesCss.includes('.hub-subtitle.subtitle-yes'), 'styles.css must style subtitle-yes');
        assert.ok(stylesCss.includes('.hub-subtitle.subtitle-support'), 'styles.css must style subtitle-support');
    });

    it('2. path-yes incorporates clean subheading styling without bullet or line', () => {
        assert.ok(pathYesHtml.includes('path-yes-page'), 'path-yes must have path-yes-page class on body');
        assert.ok(pathYesHtml.includes('class="hub-subtitle subtitle-yes"'), 'path-yes must have subtitle-yes class on subheading');
        assert.ok(!pathYesHtml.includes('pathway-heading-dot'), 'path-yes heading must not contain dot');
        assert.ok(!pathYesHtml.includes('pathway-indicator-pill'), 'path-yes must not contain separate pathway-indicator-pill');
    });

    it('3. path-support incorporates clean subheading styling without bullet or line', () => {
        assert.ok(pathSupportHtml.includes('path-support-page'), 'path-support must have path-support-page class on body');
        assert.ok(pathSupportHtml.includes('class="hub-subtitle subtitle-support"'), 'path-support must have subtitle-support class on subheading');
        assert.ok(!pathSupportHtml.includes('pathway-heading-dot'), 'path-support heading must not contain dot');
        assert.ok(!pathSupportHtml.includes('pathway-indicator-pill'), 'path-support must not contain separate pathway-indicator-pill');
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

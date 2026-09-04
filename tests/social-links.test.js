import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Subtle Social Connect Links (Instagram, Community, LinkedIn)', () => {
    const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf-8');
    const scriptJs = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf-8');
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

    it('1. styles.css defines .hli-social-connect-bar and responsive pills', () => {
        assert.ok(stylesCss.includes('.hli-social-connect-bar'), 'styles.css must define .hli-social-connect-bar');
        assert.ok(stylesCss.includes('.hli-social-pill'), 'styles.css must define .hli-social-pill');
        assert.ok(stylesCss.includes('.pill-instagram:hover'), 'styles.css must define instagram hover styling');
        assert.ok(stylesCss.includes('.pill-community:hover'), 'styles.css must define community hover styling');
        assert.ok(stylesCss.includes('.pill-linkedin:hover'), 'styles.css must define linkedin hover styling');
    });

    it('2. script.js implements initGlobalSocialLinks with valid official URLs', () => {
        assert.ok(scriptJs.includes('function initGlobalSocialLinks()'), 'script.js must define initGlobalSocialLinks');
        assert.ok(scriptJs.includes('https://www.instagram.com/hearinglossinitiative/'), 'script.js must contain official Instagram URL');
        assert.ok(scriptJs.includes('path-join-us.html'), 'script.js must contain official community link');
        assert.ok(scriptJs.includes('https://www.linkedin.com/company/hearing-loss-initiative/'), 'script.js must contain official LinkedIn URL');
        assert.ok(scriptJs.includes('initGlobalSocialLinks();'), 'script.js must initialize global social links');
    });

    it('3. index.html includes social connect bar and dropdown links', () => {
        assert.ok(indexHtml.includes('https://www.instagram.com/hearinglossinitiative/'), 'index.html must link to Instagram');
        assert.ok(indexHtml.includes('path-join-us.html'), 'index.html must link to community');
        assert.ok(indexHtml.includes('https://www.linkedin.com/company/hearing-loss-initiative/'), 'index.html must link to LinkedIn');
        assert.ok(indexHtml.includes('landing-social-bar'), 'index.html must contain landing-social-bar');
        assert.ok(indexHtml.includes('hli-social-connect-bar'), 'index.html must contain hli-social-connect-bar');
    });

    it('4. index.html places subtle #video-toggle in .landing-bottom-left-controls next to visit-bristol-disclaimer', () => {
        assert.ok(indexHtml.includes('class="landing-bottom-left-controls"'), 'index.html must have .landing-bottom-left-controls');
        assert.ok(indexHtml.includes('class="landing-bottom-right-controls'), 'index.html must have .landing-bottom-right-controls');
        assert.ok(stylesCss.includes('.landing-bottom-left-controls'), 'styles.css must style .landing-bottom-left-controls');
        assert.ok(stylesCss.includes('.landing-bottom-right-controls'), 'styles.css must style .landing-bottom-right-controls');
        assert.ok(indexHtml.indexOf('id="video-toggle"') < indexHtml.indexOf('class="visit-bristol-disclaimer"'), '#video-toggle must sit next to visit-bristol-disclaimer');
        assert.ok(stylesCss.includes('width: 28px'), '#video-toggle must be subtle 28px');
    });

    it('5. Landing page excludes floating scroll arrows as redundant', () => {
        assert.ok(scriptJs.includes("isLanding"), 'script.js must check isLanding for floating scroll controls');
        assert.ok(stylesCss.includes('body.landing-page .floating-scroll-controls'), 'styles.css must suppress scroll controls for body.landing-page');
    });
});



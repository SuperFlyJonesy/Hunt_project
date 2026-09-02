import { test, describe } from 'node:test';
import assert from 'node:assert';
import { PROLOGUE_MOMENTS } from '../data/prologue-data.js';

describe('Kinetic Prologue Moments Verification', () => {
  test('1. Exactly 6 kinetic moments are defined', () => {
    assert.strictEqual(PROLOGUE_MOMENTS.length, 6);
  });

  test('2. Moment sequence and indexes are 1 through 6', () => {
    PROLOGUE_MOMENTS.forEach((m, idx) => {
      assert.strictEqual(m.index, idx + 1);
      assert.ok(m.plainText && m.plainText.length > 0);
      assert.ok(m.html && m.html.length > 0);
      assert.ok(m.source && m.source.length > 0);
      assert.ok(m.position && m.position.desktop);
      assert.ok(m.stencil && typeof m.stencil.scale === 'number');
    });
  });

  test('3. Exclusion rules: Zero references to tinnitus, deaf, or deafness', () => {
    const jsonString = JSON.stringify(PROLOGUE_MOMENTS).toLowerCase();
    assert.strictEqual(jsonString.includes('tinnitus'), false, 'Contains "tinnitus"');
    assert.strictEqual(jsonString.includes('deafness'), false, 'Contains "deafness"');
    assert.strictEqual(jsonString.includes('deaf,'), false, 'Contains "deaf,"');
    assert.strictEqual(jsonString.includes('deaf or'), false, 'Contains "deaf or"');
    assert.strictEqual(jsonString.includes('18 million'), false, 'Contains "18 million"');
    assert.strictEqual(jsonString.includes('1 in 3'), false, 'Contains "1 in 3"');
  });

  test('4. Moment 1 accurately quotes 14.2 million UK projection', () => {
    const m1 = PROLOGUE_MOMENTS[0];
    assert.ok(m1.plainText.includes('14.2 million'));
    assert.strictEqual(m1.source, 'RNID 2035 Projections');
  });

  test('5. Moment 2 accurately quotes 62,220 Bristol adults', () => {
    const m2 = PROLOGUE_MOMENTS[1];
    assert.ok(m2.plainText.includes('62,220'));
    assert.strictEqual(m2.source, 'Bristol City Council JSNA');
  });

  test('6. Moment 3 accurately quotes 67,555 projection', () => {
    const m3 = PROLOGUE_MOMENTS[2];
    assert.ok(m3.plainText.includes('67,555'));
    assert.strictEqual(m3.source, 'Bristol City Council JSNA');
  });

  test('7. Moment 4 captures human impact of invisible barrier', () => {
    const m4 = PROLOGUE_MOMENTS[3];
    assert.ok(m4.plainText.includes('invisible barrier'));
  });

  test('8. Moment 5 highlights welcoming local venues and NHS audiology', () => {
    const m5 = PROLOGUE_MOMENTS[4];
    assert.ok(m5.plainText.includes('NHS audiology'));
    assert.ok(m5.plainText.includes('welcoming local venues'));
  });

  test('9. Moment 6 is the stable centred Step inside invitation matching landing page stencil position with subtle shadow', () => {
    const m6 = PROLOGUE_MOMENTS[5];
    assert.ok(m6.plainText.includes('Step inside'));
    assert.strictEqual(m6.position.desktop.x, 50);
    assert.strictEqual(m6.position.desktop.y, 50);
    assert.strictEqual(m6.stencil.scale, 1.0);
    assert.strictEqual(m6.stencil.translateYVh, -12);
    assert.ok(m6.stencil.opacity <= 0.15, 'Stencil should be a subtle shadow in the background');
    assert.strictEqual(m6.duration, 0);
  });

  test('10. Stencil zoom starts off-screen top (scale > 3, translateY < -40vh) and monotonically zooms down', () => {
    const m1 = PROLOGUE_MOMENTS[0];
    assert.ok(m1.stencil.scale > 3.0, 'Initial scale should be large / off-screen');
    assert.ok(m1.stencil.translateYVh <= -40, 'Initial translateY should start high off-screen');

    // Verify zoom down progression
    for (let i = 1; i < PROLOGUE_MOMENTS.length; i++) {
      assert.ok(PROLOGUE_MOMENTS[i].stencil.scale <= PROLOGUE_MOMENTS[i - 1].stencil.scale, `Scale at step ${i} should be zooming down`);
      assert.ok(PROLOGUE_MOMENTS[i].stencil.translateYVh >= PROLOGUE_MOMENTS[i - 1].stencil.translateYVh, `TranslateY at step ${i} should be descending down`);
    }
  });
});

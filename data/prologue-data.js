/**
 * Hearing Loss Initiative — Kinetic Cinematic Prologue Data
 * Single source of truth for the 6 floating cinematic moments and continuous stencil zoom trajectory.
 */
export const PROLOGUE_MOMENTS = [
  {
    id: "moment-1",
    index: 1,
    html: '<span class="base-text">By 2035, an estimated </span><strong class="highlight number-cyan">14.2 million</strong><span class="base-text"> UK adults will live with hearing loss.</span>',
    plainText: "By 2035, an estimated 14.2 million UK adults will live with hearing loss.",
    source: "RNID 2035 Projections",
    position: { desktop: { x: 38, y: 38 }, mobile: { x: 50, y: 36 } },
    stencil: { targetProgress: 0.0, scale: 14.0, translateYVh: -100, opacity: 0.0 },
    duration: 6200
  },
  {
    id: "moment-2",
    index: 2,
    html: '<span class="base-text">In Bristol, </span><strong class="highlight number-cyan">62,220</strong><span class="base-text"> adults are estimated to be affected today.</span>',
    plainText: "In Bristol, 62,220 adults are estimated to be affected today.",
    source: "Bristol City Council JSNA",
    position: { desktop: { x: 62, y: 58 }, mobile: { x: 50, y: 56 } },
    stencil: { targetProgress: 0.20, scale: 5.5, translateYVh: -65, opacity: 0.03 },
    duration: 6500
  },
  {
    id: "moment-3",
    index: 3,
    html: '<span class="base-text">Projected to rise to </span><strong class="highlight number-amber">67,555</strong><span class="base-text"> over the next decade.</span>',
    plainText: "Projected to rise to 67,555 over the next decade.",
    source: "Bristol City Council JSNA",
    position: { desktop: { x: 64, y: 36 }, mobile: { x: 50, y: 38 } },
    stencil: { targetProgress: 0.40, scale: 3.2, translateYVh: -42, opacity: 0.06 },
    duration: 6000
  },
  {
    id: "moment-4",
    index: 4,
    html: '<span class="base-text">Severe hearing loss is an </span><strong class="highlight text-amber">invisible barrier</strong><span class="base-text">.</span>',
    plainText: "Severe hearing loss is an invisible barrier.",
    source: "Bristol JSNA Estimates",
    position: { desktop: { x: 36, y: 62 }, mobile: { x: 50, y: 60 } },
    stencil: { targetProgress: 0.60, scale: 2.1, translateYVh: -26, opacity: 0.08 },
    duration: 6000
  },
  {
    id: "moment-5",
    index: 5,
    html: '<span class="base-text">Connecting NHS audiology, specialist technology, and </span><strong class="highlight text-cyan">welcoming local venues</strong><span class="base-text">.</span>',
    plainText: "Connecting NHS audiology, specialist technology, and welcoming local venues.",
    source: "Hearing Loss Initiative",
    position: { desktop: { x: 50, y: 44 }, mobile: { x: 50, y: 44 } },
    stencil: { targetProgress: 0.80, scale: 1.35, translateYVh: -16, opacity: 0.10 },
    duration: 6200
  },
  {
    id: "moment-6",
    index: 6,
    html: '<strong class="highlight-action">Step inside</strong><span class="base-text"> to explore Bristol\'s hearing loss network.</span>',
    plainText: "Step inside to explore Bristol's hearing loss network.",
    source: "Hearing Loss Initiative",
    position: { desktop: { x: 50, y: 50 }, mobile: { x: 50, y: 50 } },
    stencil: { targetProgress: 1.0, scale: 1.0, translateYVh: -12, opacity: 0.12 },
    duration: 0 // Waits for user click/enter
  }
];

if (typeof window !== 'undefined') {
  window.PROLOGUE_MOMENTS = PROLOGUE_MOMENTS;
}

// Generates assets/og-image.png (1200×630) and assets/apple-touch-icon.png (180×180)
// With --carousel flag, also generates promo/assets/carousel-{1..4}.png (1080×1350)
// Run: node scripts/gen-images.mjs
// Run: node scripts/gen-images.mjs --carousel
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = join(__dir, '..');
const out   = join(root, 'assets');
mkdirSync(out, { recursive: true });

const require = createRequire(import.meta.url);
let sharp;
try { sharp = require('sharp'); } catch {
  console.error('Run: npm install sharp   then re-run this script.');
  process.exit(1);
}

/* ── design tokens ── */
const BG      = '#e5e9f1';
const CARD    = '#f0f3fa';
const TEXT    = '#0a111c';
const SOFT    = '#2b3847';
const MUTED   = '#5d6a7b';
const LINE    = '#b1bcce';
const ACCENT  = '#e11d74';
const ACCENT2 = '#fbbf24';
const INK_BG  = '#0a111c';
const INK_TXT = '#f0f3fa';
const GREEN   = '#16a34a';

/* ── og-image SVG (1200×630) ── */
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&amp;family=Space+Mono:wght@400;700');
    </style>
  </defs>

  <!-- bg -->
  <rect width="1200" height="630" fill="${BG}"/>

  <!-- left accent bar -->
  <rect x="0" y="0" width="6" height="630" fill="${ACCENT}"/>

  <!-- subtle grid lines -->
  <line x1="0" y1="210" x2="1200" y2="210" stroke="${LINE}" stroke-width="1" opacity="0.5"/>
  <line x1="0" y1="420" x2="1200" y2="420" stroke="${LINE}" stroke-width="1" opacity="0.5"/>
  <line x1="400" y1="0" x2="400" y2="630" stroke="${LINE}" stroke-width="1" opacity="0.3"/>
  <line x1="800" y1="0" x2="800" y2="630" stroke="${LINE}" stroke-width="1" opacity="0.3"/>

  <!-- constellation (right side) -->
  <!-- hub -->
  <circle cx="940" cy="315" r="18" fill="${ACCENT}" opacity="0.15"/>
  <circle cx="940" cy="315" r="7"  fill="${ACCENT}"/>
  <!-- links -->
  <line x1="940" y1="315" x2="1060" y2="200" stroke="${LINE}" stroke-width="1.5" opacity="0.5"/>
  <line x1="940" y1="315" x2="1090" y2="300" stroke="${LINE}" stroke-width="1.5" opacity="0.5"/>
  <line x1="940" y1="315" x2="1060" y2="430" stroke="${LINE}" stroke-width="1.5" opacity="0.5"/>
  <line x1="940" y1="315" x2="980"  y2="180" stroke="${LINE}" stroke-width="1.5" opacity="0.4"/>
  <line x1="940" y1="315" x2="980"  y2="450" stroke="${LINE}" stroke-width="1.5" opacity="0.4"/>
  <!-- dots -->
  <circle cx="1060" cy="200" r="5" fill="${ACCENT}" opacity="0.7"/>
  <circle cx="1090" cy="300" r="5" fill="${ACCENT}" opacity="0.9"/>
  <circle cx="1060" cy="430" r="5" fill="${ACCENT}" opacity="0.7"/>
  <circle cx="980"  cy="180" r="4" fill="${ACCENT}" opacity="0.5"/>
  <circle cx="980"  cy="450" r="4" fill="${ACCENT}" opacity="0.5"/>
  <!-- pulse dot -->
  <circle cx="1010" cy="252" r="4" fill="${ACCENT2}" opacity="0.9"/>

  <!-- domain kicker -->
  <text x="80" y="200" font-family="'Space Mono', monospace" font-size="18" fill="${MUTED}" font-weight="400">me.balgaly.com</text>

  <!-- main heading -->
  <text x="78" y="308" font-family="'Space Grotesk', system-ui, sans-serif" font-size="80" font-weight="700" fill="${TEXT}" letter-spacing="-2.5">I am a</text>
  <text x="78" y="398" font-family="'Space Grotesk', system-ui, sans-serif" font-size="80" font-weight="700" fill="${ACCENT}" letter-spacing="-2.5">strange loop.</text>

  <!-- lede -->
  <text x="80" y="462" font-family="'Space Grotesk', system-ui, sans-serif" font-size="22" fill="${SOFT}" font-weight="400">devops manager at palo alto networks</text>

  <!-- bottom bar -->
  <rect x="0" y="590" width="1200" height="40" fill="${CARD}"/>
  <line x1="0" y1="590" x2="1200" y2="590" stroke="${LINE}" stroke-width="1"/>
  <text x="80"  y="615" font-family="'Space Mono', monospace" font-size="13" fill="${MUTED}">github.com/balgaly</text>
  <text x="1120" y="615" font-family="'Space Mono', monospace" font-size="13" fill="${ACCENT}" text-anchor="end">// co-authored-by: me.</text>
</svg>`;

/* ── apple-touch-icon SVG (180×180) ── */
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="${BG}"/>
  <!-- hub -->
  <circle cx="72" cy="90" r="28" fill="${ACCENT}" opacity="0.12"/>
  <circle cx="72" cy="90" r="9"  fill="${ACCENT}"/>
  <!-- links -->
  <line x1="72" y1="90" x2="130" y2="48"  stroke="${LINE}" stroke-width="1.5" opacity="0.6"/>
  <line x1="72" y1="90" x2="138" y2="90"  stroke="${LINE}" stroke-width="1.5" opacity="0.6"/>
  <line x1="72" y1="90" x2="130" y2="132" stroke="${LINE}" stroke-width="1.5" opacity="0.6"/>
  <!-- dots -->
  <circle cx="130" cy="48"  r="6" fill="${ACCENT}" opacity="0.7"/>
  <circle cx="138" cy="90"  r="6" fill="${ACCENT}" opacity="0.9"/>
  <circle cx="130" cy="132" r="6" fill="${ACCENT}" opacity="0.7"/>
  <!-- pulse -->
  <circle cx="101" cy="69" r="4" fill="${ACCENT2}" opacity="0.9"/>
</svg>`;

/* ── carousel SVGs (1080×1350 — LinkedIn/IG portrait 4:5) ── */

// Card 1: Hook
const carousel1 = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <rect width="1080" height="1350" fill="${BG}"/>
  <rect x="0" y="0" width="8" height="1350" fill="${ACCENT}"/>
  <line x1="0" y1="120" x2="1080" y2="120" stroke="${LINE}" stroke-width="1" opacity="0.4"/>
  <text x="72" y="82" font-family="system-ui, sans-serif" font-size="26" fill="${MUTED}" font-weight="400" letter-spacing="2">me.balgaly.com</text>
  <text x="72" y="460" font-family="system-ui, sans-serif" font-size="120" font-weight="800" fill="${TEXT}" letter-spacing="-4">i rebuilt</text>
  <text x="72" y="600" font-family="system-ui, sans-serif" font-size="120" font-weight="800" fill="${TEXT}" letter-spacing="-4">my corner</text>
  <text x="72" y="740" font-family="system-ui, sans-serif" font-size="120" font-weight="800" fill="${TEXT}" letter-spacing="-4">of the</text>
  <text x="72" y="880" font-family="system-ui, sans-serif" font-size="120" font-weight="800" fill="${ACCENT}" letter-spacing="-4">internet.</text>
  <text x="72" y="990" font-family="system-ui, sans-serif" font-size="38" fill="${SOFT}" font-weight="400">design language first. site second.</text>
  <circle cx="900" cy="1180" r="36" fill="${ACCENT}" opacity="0.1"/>
  <circle cx="900" cy="1180" r="14" fill="${ACCENT}"/>
  <line x1="900" y1="1180" x2="1020" y2="1090" stroke="${LINE}" stroke-width="2.5" opacity="0.5"/>
  <line x1="900" y1="1180" x2="1040" y2="1200" stroke="${LINE}" stroke-width="2.5" opacity="0.5"/>
  <line x1="900" y1="1180" x2="1020" y2="1270" stroke="${LINE}" stroke-width="2.5" opacity="0.5"/>
  <line x1="900" y1="1180" x2="820" y2="1080" stroke="${LINE}" stroke-width="2" opacity="0.4"/>
  <line x1="900" y1="1180" x2="820" y2="1280" stroke="${LINE}" stroke-width="2" opacity="0.4"/>
  <circle cx="1020" cy="1090" r="9" fill="${ACCENT}" opacity="0.7"/>
  <circle cx="1040" cy="1200" r="9" fill="${ACCENT}" opacity="0.9"/>
  <circle cx="1020" cy="1270" r="9" fill="${ACCENT}" opacity="0.7"/>
  <circle cx="820" cy="1080" r="7" fill="${ACCENT}" opacity="0.5"/>
  <circle cx="820" cy="1280" r="7" fill="${ACCENT}" opacity="0.5"/>
  <circle cx="960" cy="1120" r="7" fill="${ACCENT2}" opacity="0.9"/>
  <text x="72" y="1310" font-family="monospace" font-size="22" fill="${MUTED}">1 / 4</text>
  <line x1="0" y1="1330" x2="1080" y2="1330" stroke="${LINE}" stroke-width="1" opacity="0.4"/>
</svg>`;

// Card 2: Design evolution
const carousel2 = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <rect width="1080" height="1350" fill="${BG}"/>
  <rect x="0" y="0" width="8" height="1350" fill="${ACCENT}"/>
  <line x1="0" y1="120" x2="1080" y2="120" stroke="${LINE}" stroke-width="1" opacity="0.4"/>
  <text x="72" y="82" font-family="system-ui, sans-serif" font-size="26" fill="${MUTED}" font-weight="400" letter-spacing="2">the design language</text>
  <text x="72" y="240" font-family="system-ui, sans-serif" font-size="72" font-weight="800" fill="${TEXT}" letter-spacing="-2">killed the</text>
  <text x="72" y="330" font-family="system-ui, sans-serif" font-size="72" font-weight="800" fill="${ACCENT}" letter-spacing="-2">AI-slop defaults.</text>
  <text x="72" y="430" font-family="monospace" font-size="22" fill="${MUTED}" letter-spacing="2">BEFORE</text>
  <text x="560" y="430" font-family="monospace" font-size="22" fill="${ACCENT}" letter-spacing="2">AFTER</text>
  <line x1="72" y1="445" x2="1008" y2="445" stroke="${LINE}" stroke-width="1" opacity="0.5"/>
  <text x="72" y="510" font-family="system-ui, sans-serif" font-size="30" fill="${SOFT}">Sora (every AI startup)</text>
  <text x="540" y="510" font-family="monospace" font-size="20" fill="${ACCENT}">&#x2192;</text>
  <text x="576" y="510" font-family="system-ui, sans-serif" font-size="30" fill="${TEXT}" font-weight="600">Space Grotesk</text>
  <line x1="72" y1="535" x2="1008" y2="535" stroke="${LINE}" stroke-width="1" opacity="0.3"/>
  <text x="72" y="600" font-family="system-ui, sans-serif" font-size="30" fill="${SOFT}">JetBrains Mono</text>
  <text x="540" y="600" font-family="monospace" font-size="20" fill="${ACCENT}">&#x2192;</text>
  <text x="576" y="600" font-family="monospace" font-size="30" fill="${TEXT}" font-weight="600">Space Mono</text>
  <line x1="72" y1="625" x2="1008" y2="625" stroke="${LINE}" stroke-width="1" opacity="0.3"/>
  <text x="72" y="690" font-family="system-ui, sans-serif" font-size="30" fill="${SOFT}">tag pills</text>
  <text x="540" y="690" font-family="monospace" font-size="20" fill="${ACCENT}">&#x2192;</text>
  <text x="576" y="690" font-family="monospace" font-size="28" fill="${TEXT}">/ python / aws / cdk</text>
  <line x1="72" y1="715" x2="1008" y2="715" stroke="${LINE}" stroke-width="1" opacity="0.3"/>
  <text x="72" y="780" font-family="system-ui, sans-serif" font-size="30" fill="${SOFT}">green status dot</text>
  <text x="540" y="780" font-family="monospace" font-size="20" fill="${ACCENT}">&#x2192;</text>
  <rect x="576" y="758" width="90" height="30" rx="4" fill="${ACCENT}"/>
  <text x="596" y="779" font-family="monospace" font-size="18" fill="white" font-weight="700">ON AIR</text>
  <line x1="72" y1="805" x2="1008" y2="805" stroke="${LINE}" stroke-width="1" opacity="0.3"/>
  <text x="72" y="870" font-family="system-ui, sans-serif" font-size="30" fill="${SOFT}">no dark mode</text>
  <text x="540" y="870" font-family="monospace" font-size="20" fill="${ACCENT}">&#x2192;</text>
  <rect x="576" y="848" width="210" height="32" rx="6" fill="${INK_BG}"/>
  <circle cx="596" cy="864" r="8" fill="#db5c8e"/>
  <text x="614" y="870" font-family="monospace" font-size="18" fill="#db5c8e">dusty rose</text>
  <line x1="72" y1="895" x2="1008" y2="895" stroke="${LINE}" stroke-width="1" opacity="0.3"/>
  <text x="72" y="960" font-family="system-ui, sans-serif" font-size="24" fill="${MUTED}">saturated magenta vibrates on dark navy</text>
  <text x="72" y="996" font-family="system-ui, sans-serif" font-size="24" fill="${MUTED}">(chromostereopsis). dusty rose doesn't.</text>
  <text x="72" y="1310" font-family="monospace" font-size="22" fill="${MUTED}">2 / 4</text>
  <line x1="0" y1="1330" x2="1080" y2="1330" stroke="${LINE}" stroke-width="1" opacity="0.4"/>
</svg>`;

// Card 3: Site visual — constellation + terminal mock
const carousel3 = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <rect width="1080" height="1350" fill="${BG}"/>
  <rect x="0" y="0" width="8" height="1350" fill="${ACCENT}"/>
  <line x1="0" y1="120" x2="1080" y2="120" stroke="${LINE}" stroke-width="1" opacity="0.4"/>
  <text x="72" y="82" font-family="system-ui, sans-serif" font-size="26" fill="${MUTED}" font-weight="400" letter-spacing="2">me.balgaly.com</text>
  <text x="72" y="240" font-family="system-ui, sans-serif" font-size="72" font-weight="800" fill="${TEXT}" letter-spacing="-2">the build.</text>
  <text x="72" y="310" font-family="system-ui, sans-serif" font-size="32" fill="${SOFT}">static. single source of truth. token-driven.</text>
  <text x="72" y="410" font-family="monospace" font-size="22" fill="${MUTED}" letter-spacing="2">// hero constellation</text>
  <circle cx="380" cy="620" r="44" fill="${ACCENT}" opacity="0.1"/>
  <circle cx="380" cy="620" r="18" fill="${ACCENT}"/>
  <line x1="380" y1="620" x2="580" y2="480" stroke="${LINE}" stroke-width="2.5" opacity="0.5"/>
  <line x1="380" y1="620" x2="620" y2="600" stroke="${LINE}" stroke-width="2.5" opacity="0.5"/>
  <line x1="380" y1="620" x2="580" y2="760" stroke="${LINE}" stroke-width="2.5" opacity="0.5"/>
  <line x1="380" y1="620" x2="480" y2="440" stroke="${LINE}" stroke-width="2" opacity="0.4"/>
  <line x1="380" y1="620" x2="180" y2="500" stroke="${LINE}" stroke-width="2" opacity="0.4"/>
  <line x1="380" y1="620" x2="160" y2="680" stroke="${LINE}" stroke-width="2" opacity="0.4"/>
  <line x1="380" y1="620" x2="200" y2="780" stroke="${LINE}" stroke-width="2" opacity="0.4"/>
  <circle cx="580" cy="480" r="12" fill="${ACCENT}" opacity="0.7"/>
  <circle cx="620" cy="600" r="14" fill="${ACCENT}" opacity="0.9"/>
  <circle cx="580" cy="760" r="12" fill="${ACCENT}" opacity="0.7"/>
  <circle cx="480" cy="440" r="10" fill="${ACCENT}" opacity="0.5"/>
  <circle cx="180" cy="500" r="10" fill="${ACCENT}" opacity="0.6"/>
  <circle cx="160" cy="680" r="10" fill="${ACCENT}" opacity="0.5"/>
  <circle cx="200" cy="780" r="10" fill="${ACCENT}" opacity="0.5"/>
  <circle cx="480" cy="530" r="10" fill="${ACCENT2}" opacity="0.9"/>
  <text x="596" y="476" font-family="monospace" font-size="20" fill="${MUTED}">brif</text>
  <text x="636" y="604" font-family="monospace" font-size="20" fill="${MUTED}">skit</text>
  <text x="596" y="780" font-family="monospace" font-size="20" fill="${MUTED}">workwright</text>
  <text x="496" y="436" font-family="monospace" font-size="20" fill="${ACCENT2}">$dayjob</text>
  <text x="80" y="496" font-family="monospace" font-size="20" fill="${MUTED}">amit-hub</text>
  <text x="68" y="696" font-family="monospace" font-size="20" fill="${MUTED}">whetstone</text>
  <rect x="72" y="860" width="936" height="200" rx="10" fill="${INK_BG}"/>
  <text x="100" y="900" font-family="monospace" font-size="24" fill="${INK_TXT}">&#x25B8; transcribing standup.m4a</text>
  <rect x="100" y="918" width="600" height="12" rx="4" fill="${LINE}" opacity="0.3"/>
  <rect x="100" y="918" width="486" height="12" rx="4" fill="${ACCENT}"/>
  <text x="716" y="930" font-family="monospace" font-size="20" fill="${ACCENT}">81%</text>
  <text x="100" y="972" font-family="monospace" font-size="22" fill="${GREEN}">&#x2713; 1,240 words &#xB7; 14 action items</text>
  <text x="100" y="1020" font-family="monospace" font-size="20" fill="${MUTED}">&#x2514;&#x2500; written to standup-2026-w26.md</text>
  <text x="72" y="1110" font-family="system-ui, sans-serif" font-size="28" fill="${SOFT}">every card is an inline SVG, token-driven.</text>
  <text x="72" y="1150" font-family="system-ui, sans-serif" font-size="28" fill="${SOFT}">dark mode changes the accent. costs nothing.</text>
  <text x="72" y="1310" font-family="monospace" font-size="22" fill="${MUTED}">3 / 4</text>
  <line x1="0" y1="1330" x2="1080" y2="1330" stroke="${LINE}" stroke-width="1" opacity="0.4"/>
</svg>`;

// Card 4: CTA
const carousel4 = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <rect width="1080" height="1350" fill="${BG}"/>
  <rect x="0" y="0" width="8" height="1350" fill="${ACCENT}"/>
  <line x1="0" y1="120" x2="1080" y2="120" stroke="${LINE}" stroke-width="1" opacity="0.4"/>
  <text x="72" y="82" font-family="system-ui, sans-serif" font-size="26" fill="${MUTED}" font-weight="400" letter-spacing="2">strange loop</text>
  <text x="72" y="400" font-family="system-ui, sans-serif" font-size="140" font-weight="800" fill="${TEXT}" letter-spacing="-5">I am a</text>
  <text x="72" y="560" font-family="system-ui, sans-serif" font-size="140" font-weight="800" fill="${ACCENT}" letter-spacing="-5">strange</text>
  <text x="72" y="720" font-family="system-ui, sans-serif" font-size="140" font-weight="800" fill="${TEXT}" letter-spacing="-5">loop.</text>
  <line x1="72" y1="800" x2="1008" y2="800" stroke="${LINE}" stroke-width="1.5" opacity="0.5"/>
  <text x="72" y="880" font-family="monospace" font-size="34" fill="${TEXT}" font-weight="600">me.balgaly.com</text>
  <text x="72" y="940" font-family="monospace" font-size="34" fill="${TEXT}" font-weight="600">words.balgaly.com</text>
  <text x="72" y="1000" font-family="monospace" font-size="34" fill="${MUTED}">github.com/balgaly</text>
  <text x="72" y="1100" font-family="system-ui, sans-serif" font-size="30" fill="${SOFT}">build agents that do my job,</text>
  <text x="72" y="1140" font-family="system-ui, sans-serif" font-size="30" fill="${SOFT}">so i can go build the next one.</text>
  <text x="72" y="1230" font-family="monospace" font-size="22" fill="${ACCENT}">// co-authored-by: me.</text>
  <text x="72" y="1310" font-family="monospace" font-size="22" fill="${MUTED}">4 / 4</text>
  <line x1="0" y1="1330" x2="1080" y2="1330" stroke="${LINE}" stroke-width="1" opacity="0.4"/>
</svg>`;

async function gen(svgStr, filename, w, h) {
  const buf = await sharp(Buffer.from(svgStr)).resize(w, h).png().toBuffer();
  writeFileSync(join(out, filename), buf);
  console.log(`✓ assets/${filename}  (${w}×${h})`);
}

async function genCarousel() {
  const carouselOut = join(root, 'promo', 'assets');
  mkdirSync(carouselOut, { recursive: true });

  async function genC(svgStr, filename) {
    const buf = await sharp(Buffer.from(svgStr)).resize(1080, 1350).png().toBuffer();
    writeFileSync(join(carouselOut, filename), buf);
    console.log(`✓ promo/assets/${filename}  (1080x1350)`);
  }

  await genC(carousel1, 'carousel-1-hook.png');
  await genC(carousel2, 'carousel-2-design-evolution.png');
  await genC(carousel3, 'carousel-3-site-visual.png');
  await genC(carousel4, 'carousel-4-cta.png');
  console.log('carousel done.');
}

const doCarousel = process.argv.includes('--carousel');

await gen(ogSvg,   'og-image.png',          1200, 630);
await gen(iconSvg, 'apple-touch-icon.png',   180, 180);

if (doCarousel) {
  await genCarousel();
}

console.log('done.');

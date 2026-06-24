// Generates assets/og-image.png (1200×630) and assets/apple-touch-icon.png (180×180)
// Run: node scripts/gen-images.mjs
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

async function gen(svgStr, filename, w, h) {
  const buf = await sharp(Buffer.from(svgStr)).resize(w, h).png().toBuffer();
  writeFileSync(join(out, filename), buf);
  console.log(`✓ assets/${filename}  (${w}×${h})`);
}

await gen(ogSvg,   'og-image.png',          1200, 630);
await gen(iconSvg, 'apple-touch-icon.png',   180, 180);
console.log('done.');

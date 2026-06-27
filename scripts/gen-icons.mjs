// Rasterize the brand mark (app/icon.svg — three green bars on a dark
// rounded square) into the PNG sizes the site needs:
//   app/icon.png       256×256  default PNG favicon (Google/browsers downscale)
//   app/apple-icon.png 180×180  <link rel="apple-touch-icon"> (iOS home screen)
//   public/logo.png    512×512  Organization schema `logo` (SERP brand mark)
//
// Run: `node scripts/gen-icons.mjs` after editing app/icon.svg.
// sharp is a devDependency; invoke from the project root.
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";

const svg = readFileSync(new URL("../app/icon.svg", import.meta.url));

const jobs = [
  { size: 256, out: new URL("../app/icon.png", import.meta.url) },
  { size: 180, out: new URL("../app/apple-icon.png", import.meta.url) },
  { size: 512, out: new URL("../public/logo.png", import.meta.url) },
];

for (const { size, out } of jobs) {
  const png = await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
  await writeFile(out, png);
  console.log(
    `✓ ${size}×${size} → ${out.pathname.replace(/.*tokenscope-homepage/, "")} (${(png.length / 1024).toFixed(1)}KB)`,
  );
}

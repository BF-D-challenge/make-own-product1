// Generates solid-color PNG icons for PWA manifest (no external deps)
import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dir, "../public/icons");
mkdirSync(outDir, { recursive: true });

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.concat([t, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, t, data, crcVal]);
}

function makePNG(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA

  const stride = 1 + size * 4;
  const raw = Buffer.alloc(size * stride);
  const cx = size / 2, cy = size / 2, r = size / 2;
  const cornerR = size * 0.22; // rounded corner radius

  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const px = y * stride + 1 + x * 4;
      // Gradient: #38bdf8 → #6366f1 (diagonal)
      const t = (x + y) / (size * 2);
      const R = Math.round(56 + (99 - 56) * t);   // 38→63
      const G = Math.round(189 + (102 - 189) * t); // bd→66
      const B = Math.round(248 + (241 - 248) * t); // f8→f1

      // Rounded square mask
      const dx = Math.max(0, Math.abs(x - cx) - (r - cornerR));
      const dy = Math.max(0, Math.abs(y - cy) - (r - cornerR));
      const inside = Math.sqrt(dx * dx + dy * dy) <= cornerR;

      raw[px] = R;
      raw[px + 1] = G;
      raw[px + 2] = B;
      raw[px + 3] = inside ? 255 : 0; // alpha
    }
  }

  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  const file = join(outDir, `icon-${size}.png`);
  writeFileSync(file, makePNG(size));
  console.log(`✓ icon-${size}.png`);
}

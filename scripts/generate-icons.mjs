// Generate placeholder amber PNG icons for Girapp
// Uses raw PNG binary construction (no dependencies)
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function uint32BE(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n >>> 0, 0);
  return b;
}

function pngChunk(type, data) {
  const typeB = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeB, data]);
  const crc = crc32(body);
  return Buffer.concat([uint32BE(data.length), typeB, data, uint32BE(crc)]);
}

function adler32(buf) {
  let a = 1, b = 0;
  for (const x of buf) { a = (a + x) % 65521; b = (b + a) % 65521; }
  return (b << 16) | a;
}

function zlibDeflate(data) {
  // Store method (no compression), max 65535 bytes per block
  const blocks = [];
  let offset = 0;
  while (offset < data.length) {
    const chunk = data.slice(offset, offset + 65535);
    const last = offset + chunk.length >= data.length ? 1 : 0;
    const header = Buffer.alloc(5);
    header[0] = last;
    header.writeUInt16LE(chunk.length, 1);
    header.writeUInt16LE(~chunk.length & 0xffff, 3);
    blocks.push(header, chunk);
    offset += chunk.length;
  }
  const payload = Buffer.concat(blocks);
  const adler = adler32(data);
  const header = Buffer.from([0x78, 0x01]); // zlib header
  const trailer = uint32BE(adler);
  return Buffer.concat([header, payload, trailer]);
}

function makePNG(size, r, g, b) {
  const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
  const IHDR = pngChunk('IHDR', ihdrData);

  // Raw image data: each row has a filter byte (0) + RGB pixels
  const rowSize = 1 + size * 3;
  const raw = Buffer.alloc(rowSize * size);
  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // filter type: None
    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 3;
      // Simple rounded rect: corner check
      const cr = size * 0.2;
      const dx = Math.min(x, size - 1 - x);
      const dy = Math.min(y, size - 1 - y);
      const inCorner = dx < cr && dy < cr;
      const cornerDist = inCorner ? Math.sqrt((cr - dx) ** 2 + (cr - dy) ** 2) : 0;
      if (inCorner && cornerDist > cr) {
        // Outside rounded corner — white
        raw[px] = 248; raw[px + 1] = 248; raw[px + 2] = 246;
      } else {
        raw[px] = r; raw[px + 1] = g; raw[px + 2] = b;
      }
    }
  }

  const compressed = zlibDeflate(raw);
  const IDAT = pngChunk('IDAT', compressed);
  const IEND = pngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([PNG_MAGIC, IHDR, IDAT, IEND]);
}

// Amber: #f59e0b = rgb(245, 158, 11)
const icon192 = makePNG(192, 245, 158, 11);
const icon512 = makePNG(512, 245, 158, 11);

writeFileSync(join(__dirname, '../public/icon-192.png'), icon192);
writeFileSync(join(__dirname, '../public/icon-512.png'), icon512);
console.log('Icons generated! (192x192 and 512x512 amber PNG)');

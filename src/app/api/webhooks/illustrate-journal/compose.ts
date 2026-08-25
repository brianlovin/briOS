import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parse as parseFont } from "opentype.js";
import sharp from "sharp";

import { STAMP_CREAM } from "./stamp-prompt";

export const POSTER_WIDTH = 2400;
export const POSTER_HEIGHT = 1800;
export const PHOTO_RATIO = 0.58;
export const CREAM_RGB = { r: 252, g: 244, b: 233 };

const PHOTO_WIDTH = Math.round(POSTER_WIDTH * PHOTO_RATIO);
const RIGHT_WIDTH = POSTER_WIDTH - PHOTO_WIDTH;
const STAMP_HEIGHT_RATIO = 0.34;
const FONT_PATH = join(
  process.cwd(),
  "src/app/api/webhooks/illustrate-journal/fonts/LiberationMono-Regular.ttf",
);

type LoadedFont = ReturnType<typeof parseFont>;

let loadedFont: LoadedFont | undefined;

function isHeic(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  const brand = buffer.subarray(4, 12).toString("ascii");
  return brand.startsWith("ftyp") && /heic|heif|mif1|msf1/i.test(brand);
}

export async function preparePhotoBuffer(buffer: Buffer): Promise<Buffer> {
  if (isHeic(buffer)) {
    const heicModule = await import("heic-convert");
    const heicConvert = heicModule.default ?? heicModule;
    const converted = await heicConvert({
      buffer,
      format: "JPEG",
      quality: 0.92,
    });
    return Buffer.from(converted);
  }

  // Honor EXIF orientation and prove Sharp can decode before compositing.
  return sharp(buffer).rotate().toBuffer();
}

function loadFont(): LoadedFont {
  if (loadedFont) return loadedFont;
  const bytes = readFileSync(FONT_PATH);
  loadedFont = parseFont(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  return loadedFont;
}

function sampleCornerCream(
  data: Buffer,
  width: number,
  height: number,
): { r: number; g: number; b: number } {
  const corners = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    ((height - 1) * width + (width - 1)) * 4,
  ];

  const samples = corners.map((offset) => ({
    r: data[offset],
    g: data[offset + 1],
    b: data[offset + 2],
  }));

  const avg = {
    r: Math.round(samples.reduce((sum, sample) => sum + sample.r, 0) / samples.length),
    g: Math.round(samples.reduce((sum, sample) => sum + sample.g, 0) / samples.length),
    b: Math.round(samples.reduce((sum, sample) => sum + sample.b, 0) / samples.length),
  };

  const nearCreamOrWhite = samples.filter((sample) => {
    const creamDist = Math.hypot(
      sample.r - CREAM_RGB.r,
      sample.g - CREAM_RGB.g,
      sample.b - CREAM_RGB.b,
    );
    const whiteDist = Math.hypot(sample.r - 255, sample.g - 255, sample.b - 255);
    return Math.min(creamDist, whiteDist) < 36;
  });

  return nearCreamOrWhite.length >= 3 ? avg : CREAM_RGB;
}

export async function knockoutStampBackground(stamp: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(stamp)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cream = sampleCornerCream(data, info.width, info.height);

  for (let i = 0; i < info.width * info.height; i++) {
    const offset = i * 4;
    const creamDist = Math.hypot(
      data[offset] - cream.r,
      data[offset + 1] - cream.g,
      data[offset + 2] - cream.b,
    );
    const whiteDist = Math.hypot(
      data[offset] - 255,
      data[offset + 1] - 255,
      data[offset + 2] - 255,
    );
    const distance = Math.min(creamDist, whiteDist);

    if (distance < 22) {
      data[offset + 3] = 0;
    } else if (distance < 40) {
      data[offset + 3] = Math.round((data[offset + 3] * (distance - 22)) / 18);
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();
}

async function filmGrainOverlay(width: number, height: number): Promise<Buffer> {
  const size = 480;
  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const value = Math.round(Math.random() * 255);
    const offset = i * 4;
    rgba[offset] = value;
    rgba[offset + 1] = value;
    rgba[offset + 2] = value;
    rgba[offset + 3] = 16;
  }

  return sharp(rgba, { raw: { width: size, height: size, channels: 4 } })
    .resize(width, height)
    .png()
    .toBuffer();
}

async function gradePhoto(photo: Buffer): Promise<Buffer> {
  const grain = await filmGrainOverlay(PHOTO_WIDTH, POSTER_HEIGHT);

  return sharp(photo)
    .rotate()
    .resize(PHOTO_WIDTH, POSTER_HEIGHT, { fit: "cover", position: "centre" })
    .modulate({ saturation: 0.9, brightness: 1.02 })
    .linear(1.06, -10)
    .composite([{ input: grain, blend: "overlay" }])
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
}

function textSvg(lines: string[], width: number, fontSize: number, lineHeight: number): string {
  const font = loadFont();
  const paths = lines
    .map((line, index) => {
      if (!line) return "";
      const baseline = (index + 1) * lineHeight - 6;
      return font.getPath(line, 0, baseline, fontSize).toSVG(2);
    })
    .join("");

  const height = lineHeight * lines.length + 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${paths}</svg>`;
}

export async function composeFieldNotePoster(input: {
  photo: Buffer;
  stamp: Buffer;
  lines: [string, string, string, string];
}): Promise<Buffer> {
  const photo = await gradePhoto(input.photo);
  const stamp = await knockoutStampBackground(input.stamp);

  const stampMeta = await sharp(stamp).metadata();
  const maxStampHeight = Math.round(POSTER_HEIGHT * STAMP_HEIGHT_RATIO);
  const padX = Math.round(RIGHT_WIDTH * 0.14);
  const maxStampWidth = RIGHT_WIDTH - padX * 2;

  let stampWidth = stampMeta.width || maxStampWidth;
  let stampHeight = stampMeta.height || maxStampHeight;
  const scale = Math.min(maxStampWidth / stampWidth, maxStampHeight / stampHeight, 1);
  stampWidth = Math.max(1, Math.round(stampWidth * scale));
  stampHeight = Math.max(1, Math.round(stampHeight * scale));

  const resizedStamp = await sharp(stamp)
    .resize(stampWidth, stampHeight, { fit: "inside" })
    .png()
    .toBuffer();

  const stampTop = Math.round(POSTER_HEIGHT * 0.42);
  const stampLeft = PHOTO_WIDTH + padX;
  const fontSize = 26;
  const lineHeight = 36;
  const textTop = stampTop + stampHeight + 28;
  const textWidth = RIGHT_WIDTH - padX * 2;
  const text = Buffer.from(textSvg(input.lines, textWidth, fontSize, lineHeight));

  return sharp({
    create: {
      width: POSTER_WIDTH,
      height: POSTER_HEIGHT,
      channels: 3,
      background: STAMP_CREAM,
    },
  })
    .composite([
      { input: photo, left: 0, top: 0 },
      { input: resizedStamp, left: stampLeft, top: stampTop },
      { input: text, left: stampLeft, top: textTop },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

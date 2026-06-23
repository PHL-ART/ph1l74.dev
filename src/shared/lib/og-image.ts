import { readFileSync } from 'fs';
import { join } from 'path';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function getOgFont(): {
  name: string;
  data: ArrayBuffer;
  weight: 900;
  style: 'normal';
} {
  const buffer = readFileSync(
    join(process.cwd(), 'public/assets/fonts/Bounded-Black.ttf')
  );
  const data = new Uint8Array(buffer).buffer;
  return { name: 'Bounded', data, weight: 900, style: 'normal' };
}

export function getOgLogoDataUri(): string {
  const svg = readFileSync(
    join(process.cwd(), 'public/assets/icons/fa-logo.svg')
  );
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

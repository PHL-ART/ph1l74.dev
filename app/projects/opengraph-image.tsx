import { ImageResponse } from 'next/og';
import { OG_SIZE, OG_CONTENT_TYPE, getOgFont, getOgLogoDataUri, ogBranded } from '@/shared/lib/og-template';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const font = getOgFont();
  const logo = getOgLogoDataUri();
  return new ImageResponse(ogBranded('Проекты', logo), { ...OG_SIZE, fonts: [font] });
}

import { ImageResponse } from 'next/og';
import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  getOgFont,
  getOgLogoDataUri,
} from '@/shared/lib/og-image';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const font = getOgFont();
  const logo = getOgLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#0c0b0a',
          padding: '80px',
          position: 'relative',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Bounded',
            fontSize: 96,
            fontWeight: 900,
            color: '#f0f0f0',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            whiteSpace: 'pre-wrap',
          }}
        >
          {'Филат\nАстахов'}
        </div>
        <img
          src={logo}
          width={48}
          height={48}
          style={{ position: 'absolute', bottom: 56, left: 80 }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            fontFamily: 'monospace',
            fontSize: 13,
            color: '#444',
            letterSpacing: '2px',
          }}
        >
          PH1L74.DEV
        </span>
      </div>
    ),
    { ...OG_SIZE, fonts: [font] }
  );
}

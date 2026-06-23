import { readFileSync } from 'fs';
import { join } from 'path';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function getOgFont() {
  const buffer = readFileSync(join(process.cwd(), 'public/assets/fonts/Bounded-Black.ttf'));
  const data = new Uint8Array(buffer).buffer;
  return { name: 'Bounded', data, weight: 900 as const, style: 'normal' as const };
}

export function getOgLogoDataUri(): string {
  const svg = readFileSync(join(process.cwd(), 'public/assets/icons/fa-logo.svg'));
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export function ogBranded(title: string, logo: string) {
  return (
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
        {title}
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
  );
}

export function ogProject(
  title: string,
  year: number,
  category: string | null,
  imageUrl: string,
  logo: string,
) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
      <img
        src={imageUrl}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.65)',
          display: 'flex',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
          <div
            style={{
              fontFamily: 'Bounded',
              fontSize: 80,
              fontWeight: 900,
              color: '#f0f0f0',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={logo} width={40} height={40} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#bbb',
              letterSpacing: '2px',
            }}
          >
            {category ? `${year} · ${category.toUpperCase()}` : String(year)}
          </span>
        </div>
      </div>
    </div>
  );
}

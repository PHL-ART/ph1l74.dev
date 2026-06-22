import { ImageResponse } from 'next/og';
import prisma from '@/shared/api/database/prisma';
import { OG_SIZE, OG_CONTENT_TYPE, getOgFont, getOgLogoDataUri } from '@/shared/lib/og-image';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: { slug: string } }) {
  const font = getOgFont();
  const logo = getOgLogoDataUri();

  const project = await prisma.project.findUnique({
    where: { shortname: params.slug },
    select: {
      title: true,
      images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
    },
  });

  const title = project?.title ?? 'Проект';
  const firstImage = project?.images[0]?.url ?? null;

  if (firstImage) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
          <img src={firstImage} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.65)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', padding: '80px', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Bounded', fontSize: 80, fontWeight: 900, color: '#f0f0f0', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {title}
            </div>
          </div>
          <img src={logo} width={48} height={48} style={{ position: 'absolute', bottom: 56, left: 80 }} />
          <span style={{ position: 'absolute', bottom: 60, right: 80, fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>
            PH1L74.DEV
          </span>
        </div>
      ),
      { ...OG_SIZE, fonts: [font] }
    );
  }

  // Fallback: branded template
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0c0b0a', padding: '80px', position: 'relative', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Bounded', fontSize: 80, fontWeight: 900, color: '#f0f0f0', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {title}
        </div>
        <img src={logo} width={48} height={48} style={{ position: 'absolute', bottom: 56, left: 80 }} />
        <span style={{ position: 'absolute', bottom: 80, right: 80, fontFamily: 'monospace', fontSize: 13, color: '#444', letterSpacing: '2px' }}>
          PH1L74.DEV
        </span>
      </div>
    ),
    { ...OG_SIZE, fonts: [font] }
  );
}

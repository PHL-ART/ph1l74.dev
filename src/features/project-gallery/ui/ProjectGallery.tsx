'use client';

import { useState } from 'react';
import { ImageLightbox, type GalleryImage } from './ImageLightbox';

interface Props {
  images: GalleryImage[];
}

export function ProjectGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const goNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  const goPrev = () =>
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length
    );

  return (
    <section className="ds-gallery">
      <div className="ds-gallery-label">Галерея</div>
      <div className="ds-gallery-strip">
        {images.map((img, i) => (
          <button
            key={img.id}
            className="ds-gallery-thumb"
            onClick={() => setActiveIndex(i)}
            aria-label={img.alt ?? `Изображение ${i + 1}`}
          >
            <img src={img.url} alt={img.alt ?? ''} />
          </button>
        ))}
      </div>
      {activeIndex !== null && (
        <ImageLightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </section>
  );
}

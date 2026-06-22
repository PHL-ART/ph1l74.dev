'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ImageLightbox, type GalleryImage } from './ImageLightbox';

interface Props {
  images: GalleryImage[];
}

export function ProjectGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const goNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const goPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  if (images.length === 0) return null;

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
      <AnimatePresence>
        {activeIndex !== null && (
          <ImageLightbox
            images={images}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

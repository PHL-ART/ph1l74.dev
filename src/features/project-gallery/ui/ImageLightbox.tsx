'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type GalleryImage = {
  id: number;
  url: string;
  alt: string | null;
  order: number;
};

interface Props {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ImageLightbox({ images, index, onClose, onNext, onPrev }: Props) {
  const image = images[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      <motion.div
        className="ds-lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="ds-lightbox-content"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) onNext();
            if (info.offset.x > 80) onPrev();
          }}
        >
          <img src={image.url} alt={image.alt ?? ''} className="ds-lightbox-img" />
          {images.length > 1 && (
            <>
              <button
                className="ds-lightbox-btn ds-lightbox-prev"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                aria-label="Предыдущее"
              >←</button>
              <button
                className="ds-lightbox-btn ds-lightbox-next"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                aria-label="Следующее"
              >→</button>
            </>
          )}
          <button
            className="ds-lightbox-close"
            onClick={onClose}
            aria-label="Закрыть"
          >✕</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

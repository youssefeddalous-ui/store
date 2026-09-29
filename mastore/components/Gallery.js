'use client';
import { useState } from 'react';

export default function Gallery({ images, alt }) {
  const [i, setI] = useState(0);
  if (!images.length) return <div className="photo" />;
  return (
    <div className="gallery">
      <div className="photo"><img src={images[i]} alt={alt} /></div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, k) => (
            <button key={k} type="button" aria-current={k === i} aria-label={`Image ${k + 1}`} onClick={() => setI(k)}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

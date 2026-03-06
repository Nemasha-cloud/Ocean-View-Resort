import React, { useEffect, useState } from 'react';

const fallbackImages = [
  {
    src: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Oceanfront resort view',
  },
  {
    src: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Luxury resort pool',
  },
  {
    src: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Beachside villa exterior',
  },
  {
    src: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Infinity pool at sunset',
  },
  {
    src: 'https://images.pexels.com/photos/754268/pexels-photo-754268.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Elegant resort lounge area',
  },
  {
    src: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Private beach and palm trees',
  },
  {
    src: 'https://images.pexels.com/photos/261156/pexels-photo-261156.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Luxury resort bedroom interior',
  },
  {
    src: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Tropical beach sunset scene',
  },
  {
    src: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Resort dining table setup',
  },
  {
    src: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Infinity pool with sea horizon',
  },
  {
    src: 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Ocean view balcony seating',
  },
  {
    src: 'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2',
    alt: 'Palm-lined luxury resort pathway',
  },
];

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState(fallbackImages);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setGalleryImages(data.map(item => ({
            src: item.imageUrl,
            alt: item.caption || 'Ocean View Resort gallery image'
          })));
        }
      } catch (err) {
        // Keep fallback images when API is unavailable.
      }
    };

    fetchGallery();
  }, []);

  return (
    <section className="gallery-page">
      <div className="gallery-header">
        <p className="gallery-eyebrow">Ocean View Resort</p>
        <h1>Gallery</h1>
        <p>
          Explore moments of coastal luxury, serene landscapes, and signature spaces across our resort.
        </p>
      </div>

      <div className="gallery-grid-page">
        {galleryImages.map((image, index) => (
          <article key={image.src} className="gallery-card-page">
            <img src={image.src} alt={image.alt} loading={index < 2 ? 'eager' : 'lazy'} />
          </article>
        ))}
      </div>
    </section>
  );
};

export default Gallery;

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import './internshipsSections.css';

const PARTNER_LOGOS = [
  { src: '/images/Logos/Partners/aum.jpg', alt: 'Auburn University at Montgomery' },
  { src: '/images/Logos/Partners/mississippi-state.png', alt: 'Mississippi State University' },
  { src: '/images/Logos/Partners/ua.png', alt: 'The University of Alabama' },
  { src: '/images/Logos/Partners/uab.png', alt: 'The University of Alabama at Birmingham' },
  { src: '/images/Logos/Partners/south-alabama.jpg', alt: 'University of South Alabama' },
  { src: '/images/Logos/Partners/alabama-am.png', alt: 'Alabama A&M University' },
  { src: '/images/Logos/Partners/ole-miss.png', alt: 'University of Mississippi' },
  { src: '/images/Logos/Partners/spring-hill.png', alt: 'Spring Hill College' },
  { src: '/images/Logos/Partners/purdue.png', alt: 'Purdue University' },
  { src: '/images/Logos/Partners/auburn.png', alt: 'Auburn University' },
  { src: '/images/Logos/Partners/uah.png', alt: 'The University of Alabama in Huntsville' },
  { src: '/images/Logos/Partners/una.png', alt: 'University of North Alabama' },
  { src: '/images/Logos/Partners/troy.png', alt: 'Troy University' },
  { src: '/images/Logos/Partners/athens-state.jpg', alt: 'Athens State University' },
  { src: '/images/Logos/Partners/jacksonville-state.png', alt: 'Jacksonville State University' },
  { src: '/images/Logos/Partners/tuskegee.png', alt: 'Tuskegee University' },
  { src: '/images/Logos/Partners/calhoun.png', alt: 'Calhoun Community College' },
  { src: '/images/Logos/Partners/shelton-state.jpg', alt: 'Shelton State Community College' },
  { src: '/images/Logos/Partners/embry-riddle.png', alt: 'Embry-Riddle Aeronautical University' },
  { src: '/images/Logos/Partners/cochise.png', alt: 'Cochise College' },
];

const LOGOS_PER_SLIDE = 10;
const mockFont = 'Georgia, "Times New Roman", Times, serif';

type PartnerCollegesProps = {
  heading?: string;
  body?: string;
  footnote?: string;
};

export default function PartnerColleges({
  heading = 'Partnering Colleges and Universities',
  body = 'The APC partners with colleges and universities to connect talented students with hands-on industry opportunities.',
  footnote,
}: PartnerCollegesProps) {
  const slides = useMemo(() => {
    const pages: (typeof PARTNER_LOGOS)[] = [];
    for (let i = 0; i < PARTNER_LOGOS.length; i += LOGOS_PER_SLIDE) {
      pages.push(PARTNER_LOGOS.slice(i, i + LOGOS_PER_SLIDE));
    }
    return pages;
  }, []);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section className="apc-intern-section" style={{ color: '#000000' }}>
      <div
        style={{
          backgroundColor: '#d9b2b2',
          backgroundImage: 'linear-gradient(90deg, #d4a8a8 0%, #e5c8c0 100%)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: mockFont,
            color: '#000000',
            fontWeight: 400,
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            margin: '0 0 0.75rem',
            lineHeight: 1.2,
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontFamily: mockFont,
            color: '#000000',
            textAlign: 'center',
            maxWidth: '48rem',
            margin: '0 auto',
            fontSize: '0.95rem',
          }}
        >
          {body}
        </p>
        {footnote ? (
          <p
            style={{
              fontFamily: mockFont,
              fontStyle: 'italic',
              color: '#000000',
              textAlign: 'center',
              maxWidth: '48rem',
              margin: '0.85rem auto 0',
              fontSize: '0.8rem',
            }}
          >
            {footnote}
          </p>
        ) : null}
      </div>

      <div
        style={{ backgroundColor: '#ffffff', padding: '2.5rem 1.5rem 1.5rem' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-roledescription="carousel"
        aria-label="Partner college logos"
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto', overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              width: `${slides.length * 100}%`,
              transform: `translateX(-${(index * 100) / slides.length}%)`,
              transition: 'transform 500ms ease-in-out',
            }}
          >
            {slides.map((slide, slideIdx) => (
              <div
                key={slideIdx}
                style={{
                  width: `${100 / slides.length}%`,
                  flexShrink: 0,
                  padding: '0 0.5rem',
                  boxSizing: 'border-box',
                }}
                aria-hidden={slideIdx !== index}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                    gap: '1.75rem 1.5rem',
                    alignItems: 'center',
                    justifyItems: 'center',
                    minHeight: 220,
                  }}
                  className="apc-intern-logo-slide"
                >
                  {slide.map((logo) => (
                    <div
                      key={logo.src}
                      style={{
                        height: 112,
                        width: '100%',
                        maxWidth: 220,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.25rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          display: 'block',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 10,
              marginTop: '1.75rem',
              paddingBottom: '0.5rem',
            }}
            role="tablist"
            aria-label="Partner logo pages"
          >
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                role="tab"
                aria-selected={dotIdx === index}
                aria-label={`Show partner logos page ${dotIdx + 1}`}
                onClick={() => setIndex(dotIdx)}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: dotIdx === index ? '#9E1B32' : '#000000',
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

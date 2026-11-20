'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './internshipsSections.css';

type BannerSlide = string | { src: string; objectPosition?: string };

type StoriesVideoCtaProps = {
  heading: string;
  body: string;
  videoTitle: string;
  videoSrc?: string;
  ctaLabel?: string;
  bannerImageSrc?: string;
  bannerImages?: BannerSlide[];
  bannerText?: string;
  bannerObjectPosition?: string;
  backgroundColor?: string;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

function normalizeSlide(
  slide: BannerSlide,
  fallbackPosition: string,
): { src: string; objectPosition: string } {
  if (typeof slide === 'string') {
    return { src: slide, objectPosition: fallbackPosition };
  }
  return {
    src: slide.src,
    objectPosition: slide.objectPosition || fallbackPosition,
  };
}

export default function StoriesVideoCta({
  heading,
  body,
  videoTitle,
  videoSrc,
  ctaLabel = 'View Intern Success Stories',
  bannerImageSrc,
  bannerImages,
  bannerText,
  bannerObjectPosition = 'center 32%',
  backgroundColor = '#ffffff',
}: StoriesVideoCtaProps) {
  const slides =
    bannerImages && bannerImages.length > 0
      ? bannerImages.map((slide) => normalizeSlide(slide, bannerObjectPosition))
      : bannerImageSrc
        ? [normalizeSlide(bannerImageSrc, bannerObjectPosition)]
        : [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <>
      {slides.length > 0 && bannerText ? (
        <section
          style={{ position: 'relative', width: '100%', minHeight: 220, overflow: 'hidden' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="This could be you"
        >
          {slides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: slide.objectPosition,
                opacity: i === index ? 1 : 0,
                transition: 'opacity 700ms ease-in-out',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(158, 27, 50, 0.55)',
            }}
          />
          <div
            style={{
              position: 'relative',
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1rem 2.5rem',
              gap: '1rem',
            }}
          >
            <p
              style={{
                fontFamily: mockFont,
                color: '#ffffff',
                fontWeight: 400,
                textAlign: 'center',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                margin: 0,
              }}
            >
              {bannerText}
            </p>
            {slides.length > 1 ? (
              <div
                style={{ display: 'flex', gap: 8 }}
                role="tablist"
                aria-label="This could be you slides"
              >
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    role="tab"
                    aria-selected={dotIdx === index}
                    aria-label={`Show image ${dotIdx + 1}`}
                    onClick={() => setIndex(dotIdx)}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.85)',
                      padding: 0,
                      cursor: 'pointer',
                      backgroundColor:
                        dotIdx === index ? '#ffffff' : 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section
        className="apc-intern-section"
        style={{ backgroundColor, color: '#000000', padding: '3rem 1.5rem' }}
      >
        <div className="apc-intern-stories-grid">
          <div>
            <h2
              style={{
                fontFamily: mockFont,
                color: '#9E1B32',
                fontWeight: 400,
                fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                margin: '0 0 1rem',
                lineHeight: 1.2,
              }}
            >
              {heading}
            </h2>
            <p
              style={{
                fontFamily: mockFont,
                color: '#000000',
                margin: '0 0 1.5rem',
                fontSize: '1rem',
              }}
            >
              {body}
            </p>
            <Link
              href="/Home/SuccessStories"
              style={{
                display: 'inline-flex',
                borderRadius: 9999,
                padding: '0.65rem 1.75rem',
                fontSize: 15,
                backgroundColor: '#9E1B32',
                color: '#ffffff',
                fontFamily: mockFont,
                textDecoration: 'none',
                boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
              }}
            >
              {ctaLabel}
            </Link>
          </div>
          <div style={{ width: '100%' }}>
            {videoSrc ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  backgroundColor: '#000000',
                }}
              >
                <iframe
                  src={videoSrc}
                  title={videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                    display: 'block',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  backgroundColor: '#d0d0d0',
                  border: '1px dashed #9a9a9a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontFamily: mockFont, color: '#666666', fontSize: '0.9rem' }}>
                  Video placeholder
                  <br />
                  {videoTitle}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

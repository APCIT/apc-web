import React from 'react';
import Link from 'next/link';
import './internshipsSections.css';

type StoriesVideoCtaProps = {
  heading: string;
  body: string;
  videoTitle: string;
  videoSrc?: string;
  ctaLabel?: string;
  bannerImageSrc?: string;
  bannerText?: string;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function StoriesVideoCta({
  heading,
  body,
  videoTitle,
  videoSrc,
  ctaLabel = 'View Intern Success Stories',
  bannerImageSrc,
  bannerText,
}: StoriesVideoCtaProps) {
  return (
    <>
      {bannerImageSrc && bannerText ? (
        <section style={{ position: 'relative', width: '100%', minHeight: 180, overflow: 'hidden' }}>
          <img
            src={bannerImageSrc}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 25%',
            }}
          />
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
              minHeight: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1rem',
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
          </div>
        </section>
      ) : null}

      <section
        className="apc-intern-section"
        style={{ backgroundColor: '#ffffff', color: '#000000', padding: '3rem 1.5rem' }}
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

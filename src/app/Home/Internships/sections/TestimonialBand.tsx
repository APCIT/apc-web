import React from 'react';

type TestimonialBandProps = {
  quote: string;
  attribution: string;
  roleLines?: string[];
  variant?: 'student' | 'company';
  heading?: string;
  /** Shown as a text placeholder instead of an image */
  logoPlaceholder?: string;
  logoSrc?: string;
  logoAlt?: string;
  /** Optional portrait for student testimonials */
  portraitSrc?: string;
  portraitAlt?: string;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function TestimonialBand({
  quote,
  attribution,
  roleLines = [],
  variant = 'student',
  heading,
  logoPlaceholder,
  logoSrc,
  logoAlt = '',
  portraitSrc,
  portraitAlt = '',
}: TestimonialBandProps) {
  const isStudent = variant === 'student';
  const textColor = isStudent ? '#ffffff' : '#000000';
  const showPortrait = isStudent;
  const showLogo = Boolean(logoSrc || logoPlaceholder);

  return (
    <section
      style={{
        width: '100%',
        backgroundColor: isStudent ? '#3a3a3a' : '#ffffff',
        color: textColor,
        padding: '3rem 1.5rem',
        boxSizing: 'border-box',
      }}
    >
      {heading ? (
        <h2
          style={{
            fontFamily: mockFont,
            color: '#000000',
            fontWeight: 400,
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            margin: '0 0 2.5rem',
            lineHeight: 1.2,
          }}
        >
          {heading}
        </h2>
      ) : null}

      <div
        style={{
          maxWidth: '64rem',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          paddingRight: isStudent ? 0 : '2.75rem',
        }}
      >
        {showPortrait ? (
          <div
            style={{
              flex: '0 1 260px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {portraitSrc ? (
              <img
                src={portraitSrc}
                alt={portraitAlt || attribution}
                style={{
                  width: 240,
                  height: 240,
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  width: 240,
                  height: 240,
                  backgroundColor: '#555555',
                  border: '1px dashed #9a9a9a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '0.75rem',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontFamily: mockFont, color: '#dddddd', fontSize: '0.85rem' }}>
                  {attribution}
                  <br />
                  photo placeholder
                </span>
              </div>
            )}
          </div>
        ) : null}

        {showLogo ? (
          <div
            style={{
              flex: '1 1 220px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={logoAlt || logoPlaceholder || 'Company logo'}
                style={{
                  width: '100%',
                  maxWidth: 340,
                  height: 'auto',
                  maxHeight: 190,
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  width: 220,
                  height: 120,
                  backgroundColor: '#e8e8e8',
                  border: '1px dashed #9a9a9a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '0.75rem',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontFamily: mockFont, color: '#666666', fontSize: '0.8rem' }}>
                  {logoPlaceholder}
                  <br />
                  logo placeholder
                </span>
              </div>
            )}
          </div>
        ) : null}

        <div
          style={{
            flex: '2 1 320px',
            borderLeft: isStudent ? undefined : '2px solid #9E1B32',
            paddingLeft: isStudent ? 0 : '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <p
              aria-hidden
              style={{
                fontFamily: mockFont,
                color: '#9E1B32',
                fontSize: '3rem',
                lineHeight: 0.8,
                margin: 0,
                flexShrink: 0,
              }}
            >
              &ldquo;
            </p>
            {!isStudent ? (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: '#9E1B32',
                  marginTop: 14,
                }}
              />
            ) : null}
          </div>
          <blockquote
            style={{
              fontFamily: mockFont,
              color: textColor,
              margin: '0.75rem 0 0',
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            {quote}
          </blockquote>
          <div
            style={{
              height: 3,
              width: '100%',
              maxWidth: 280,
              backgroundColor: '#9E1B32',
              marginTop: 20,
            }}
          />
          <p
            style={{
              fontFamily: mockFont,
              color: textColor,
              fontWeight: 700,
              margin: '0.75rem 0 0',
              fontSize: '1.05rem',
            }}
          >
            {attribution}
          </p>
          {roleLines.map((line) => (
            <p
              key={line}
              style={{
                fontFamily: mockFont,
                color: textColor,
                margin: '2px 0 0',
                opacity: 0.92,
                fontSize: '0.95rem',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {!isStudent ? (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              right: '-0.35rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9E1B32',
              fontSize: '2.75rem',
              fontFamily: mockFont,
              fontWeight: 300,
              lineHeight: 1,
              display: 'none',
              paddingLeft: '1rem',
            }}
            className="apc-intern-testimonial-chevron"
          >
            ›
          </div>
        ) : null}
      </div>
    </section>
  );
}

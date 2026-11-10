import React from 'react';

type TestimonialBandProps = {
  quote: string;
  attribution: string;
  roleLines?: string[];
  variant?: 'student' | 'company';
  /** Shown as a text placeholder instead of an image */
  logoPlaceholder?: string;
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
  logoPlaceholder,
  portraitSrc,
  portraitAlt = '',
}: TestimonialBandProps) {
  const isStudent = variant === 'student';
  const textColor = isStudent ? '#ffffff' : '#000000';
  const showPortrait = isStudent;
  const showLogo = Boolean(logoPlaceholder);

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
      <div
        style={{
          maxWidth: '64rem',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '2rem',
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
          </div>
        ) : null}

        <div style={{ flex: '2 1 320px' }}>
          <p
            aria-hidden
            style={{
              fontFamily: mockFont,
              color: '#9E1B32',
              fontSize: '3rem',
              lineHeight: 1,
              margin: '0 0 0.5rem',
            }}
          >
            &ldquo;
          </p>
          {!isStudent ? (
            <div
              style={{
                height: 1,
                width: '100%',
                maxWidth: 420,
                backgroundColor: '#9E1B32',
                marginBottom: 16,
              }}
            />
          ) : null}
          <blockquote
            style={{
              fontFamily: mockFont,
              color: textColor,
              margin: 0,
              fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            {quote}
          </blockquote>
          <div
            style={{
              height: 1,
              width: 96,
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
      </div>
    </section>
  );
}

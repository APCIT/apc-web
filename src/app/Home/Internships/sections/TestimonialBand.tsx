'use client';

import React, { useEffect, useState } from 'react';

export type TestimonialItem = {
  quote: string;
  attribution: string;
  roleLines?: string[];
  logoSrc?: string;
  logoAlt?: string;
};

type TestimonialBandProps = {
  items: TestimonialItem[];
  variant?: 'student' | 'company';
  heading?: string;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

function SlideContent({
  item,
  isStudent,
  textColor,
}: {
  item: TestimonialItem;
  isStudent: boolean;
  textColor: string;
}) {
  return (
    <>
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
        {item.quote}
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
        {item.attribution}
      </p>
      {(item.roleLines || []).map((line) => (
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
    </>
  );
}

export default function TestimonialBand({
  items,
  variant = 'student',
  heading,
}: TestimonialBandProps) {
  const isStudent = variant === 'student';
  const textColor = isStudent ? '#ffffff' : '#000000';
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasLogos = items.some((item) => item.logoSrc);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  if (!items.length) return null;

  const goNext = () => setIndex((i) => (i + 1) % items.length);
  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <section
      style={{
        width: '100%',
        backgroundColor: isStudent ? '#3a3a3a' : '#ffffff',
        color: textColor,
        padding: '3rem 1.5rem',
        boxSizing: 'border-box',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={heading || (isStudent ? 'Intern testimonials' : 'Company testimonials')}
    >
      {heading ? (
        <h2
          style={{
            fontFamily: mockFont,
            color: isStudent ? '#ffffff' : '#000000',
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
          paddingRight: items.length > 1 ? '2.75rem' : 0,
        }}
      >
        {hasLogos ? (
          <div
            style={{
              flex: '1 1 220px',
              display: 'grid',
              alignItems: 'center',
              justifyItems: 'center',
              minHeight: 160,
            }}
          >
            {items.map((slide, slideIdx) => (
              <div
                key={`${slide.attribution}-logo`}
                style={{
                  gridArea: '1 / 1',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: slideIdx === index ? 1 : 0,
                  transition: 'opacity 450ms ease',
                  pointerEvents: slideIdx === index ? 'auto' : 'none',
                }}
                aria-hidden={slideIdx !== index}
              >
                {slide.logoSrc ? (
                  <img
                    src={slide.logoSrc}
                    alt={slideIdx === index ? slide.logoAlt || slide.attribution : ''}
                    style={{
                      width: '100%',
                      maxWidth: 300,
                      height: 'auto',
                      maxHeight: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        <div
          style={{
            flex: '2 1 320px',
            borderLeft: isStudent ? undefined : '2px solid #9E1B32',
            paddingLeft: isStudent ? 0 : '1.25rem',
            display: 'grid',
          }}
        >
          {items.map((slide, slideIdx) => (
            <div
              key={`${slide.attribution}-copy`}
              style={{
                gridArea: '1 / 1',
                opacity: slideIdx === index ? 1 : 0,
                transition: 'opacity 450ms ease',
                pointerEvents: slideIdx === index ? 'auto' : 'none',
              }}
              aria-hidden={slideIdx !== index}
            >
              <SlideContent item={slide} isStudent={isStudent} textColor={textColor} />
            </div>
          ))}
        </div>

        {items.length > 1 ? (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
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
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            ›
          </button>
        ) : null}
      </div>

      {items.length > 1 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            marginTop: '1.75rem',
          }}
          role="tablist"
          aria-label="Testimonial slides"
        >
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            style={{
              background: 'none',
              border: 'none',
              color: '#9E1B32',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 0.35rem',
            }}
          >
            ‹
          </button>
          {items.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              role="tab"
              aria-selected={dotIdx === index}
              aria-label={`Show testimonial ${dotIdx + 1}`}
              onClick={() => setIndex(dotIdx)}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: dotIdx === index ? '#9E1B32' : isStudent ? '#ffffff' : '#c4c4c4',
              }}
            />
          ))}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            style={{
              background: 'none',
              border: 'none',
              color: '#9E1B32',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 0.35rem',
            }}
          >
            ›
          </button>
        </div>
      ) : null}
    </section>
  );
}

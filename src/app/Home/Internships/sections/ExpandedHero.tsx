import React from 'react';
import './internshipsSections.css';

type ExpandedHeroProps = {
  tagline: string;
  subtitle?: string;
  backgroundImage: string;
  objectPosition?: string;
  align?: 'left' | 'center';
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function ExpandedHero({
  tagline,
  subtitle,
  backgroundImage,
  objectPosition = 'center',
  align = 'center',
}: ExpandedHeroProps) {
  const isCentered = align === 'center';

  return (
    <div className="apc-intern-hero" style={{ minHeight: '28vh' }}>
      <img
        src={backgroundImage}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
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
          zIndex: 10,
          width: '100%',
          maxWidth: '48rem',
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
          textAlign: isCentered ? 'center' : 'left',
        }}
      >
        <h2
          style={{
            fontFamily: mockFont,
            color: '#ffffff',
            fontWeight: 400,
            margin: 0,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            lineHeight: 1.15,
          }}
        >
          {tagline}
        </h2>
        {subtitle ? (
          <p
            style={{
              fontFamily: mockFont,
              fontStyle: 'italic',
              color: '#ffffff',
              fontWeight: 400,
              margin: '0.75rem 0 0',
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

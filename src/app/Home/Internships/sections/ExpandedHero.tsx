import React from 'react';
import './internshipsSections.css';

type ExpandedHeroProps = {
  tagline: string;
  backgroundImage: string;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function ExpandedHero({ tagline, backgroundImage }: ExpandedHeroProps) {
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
          objectPosition: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(100, 20, 30, 0.4)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '56rem', padding: '2.5rem 1.5rem' }}>
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
      </div>
    </div>
  );
}

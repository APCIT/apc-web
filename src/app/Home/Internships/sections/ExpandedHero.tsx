import React from 'react';
import './internshipsSections.css';

type ExpandedHeroProps = {
  tagline: string;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function ExpandedHero({ tagline }: ExpandedHeroProps) {
  return (
    <div className="apc-intern-hero" style={{ minHeight: '28vh' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#6b2a32',
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 12px, transparent 12px 24px)',
        }}
        aria-hidden
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: mockFont,
          fontSize: '0.85rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        Hero image placeholder
      </div>
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

import React from 'react';

type ReadyCtaBandProps = {
  heading?: string;
  subtext: string;
  ctaLabel: string;
  onCtaClick: () => void;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function ReadyCtaBand({
  heading = 'Ready To Get Started?',
  subtext,
  ctaLabel,
  onCtaClick,
}: ReadyCtaBandProps) {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '4rem 1.5rem 5rem',
        textAlign: 'center',
        backgroundColor: '#9E1B32',
        backgroundImage: "url('/images/crimson-lowpoly-facets.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '40rem', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: mockFont,
            color: '#ffffff',
            fontWeight: 400,
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            margin: '0 0 0.75rem',
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontFamily: mockFont,
            color: '#ffffff',
            margin: '0 0 2rem',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          }}
        >
          {subtext}
        </p>
        <button
          type="button"
          onClick={onCtaClick}
          style={{
            borderRadius: 9999,
            padding: '0.75rem 2.5rem',
            fontSize: 17,
            backgroundColor: '#ffffff',
            color: '#9E1B32',
            fontFamily: mockFont,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
            fontWeight: 600,
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}

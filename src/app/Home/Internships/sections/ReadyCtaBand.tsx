import React from 'react';

type ReadyCtaBandProps = {
  subtext: string;
  ctaLabel: string;
  onCtaClick: () => void;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function ReadyCtaBand({
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
        backgroundImage:
          'linear-gradient(135deg, rgba(0,0,0,0.14) 25%, transparent 25%), linear-gradient(225deg, rgba(0,0,0,0.14) 25%, transparent 25%), linear-gradient(45deg, rgba(0,0,0,0.14) 25%, transparent 25%), linear-gradient(315deg, rgba(0,0,0,0.14) 25%, transparent 25%)',
        backgroundSize: '42px 42px',
        backgroundPosition: '0 0, 0 21px, 21px -21px, -21px 0',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: mockFont,
            color: '#ffffff',
            fontWeight: 400,
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            margin: '0 0 0.75rem',
          }}
        >
          Ready To Get Started?
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

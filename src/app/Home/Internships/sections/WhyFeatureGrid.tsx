import React, { type ReactNode } from 'react';
import './internshipsSections.css';

export type WhyFeature = {
  title: string;
  description: string;
  icon: ReactNode;
};

type WhyFeatureGridProps = {
  heading: string;
  features: WhyFeature[];
  ctaLabel: string;
  onCtaClick: () => void;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function WhyFeatureGrid({
  heading,
  features,
  ctaLabel,
  onCtaClick,
}: WhyFeatureGridProps) {
  return (
    <section
      className="apc-intern-section"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '3rem 1.5rem',
      }}
    >
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
      <div className="apc-intern-why-grid">
        {features.map((feature) => (
          <article
            key={feature.title}
            style={{
              backgroundColor: '#A2A5A4',
              color: '#ffffff',
              padding: '1.25rem 1rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ color: '#9E1B32', marginBottom: '0.65rem' }}>{feature.icon}</div>
            <h3
              style={{
                fontFamily: mockFont,
                color: '#000000',
                fontWeight: 600,
                fontSize: '1.05rem',
                margin: '0 0 0.5rem',
                lineHeight: 1.25,
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontFamily: mockFont,
                color: '#ffffff',
                fontSize: '0.9rem',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {feature.description}
            </p>
          </article>
        ))}
      </div>
      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={onCtaClick}
          style={{
            minWidth: 240,
            borderRadius: 9999,
            padding: '0.75rem 2.5rem',
            fontSize: 17,
            backgroundColor: '#9E1B32',
            color: '#ffffff',
            fontFamily: mockFont,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}

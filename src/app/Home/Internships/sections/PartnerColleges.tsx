import React from 'react';
import './internshipsSections.css';

const PARTNER_PLACEHOLDERS = [
  'University of Mississippi',
  'The University of Alabama',
  'UAH',
  'Purdue University',
  'Calhoun Community College',
  'Auburn University',
  'Athens State University',
];

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function PartnerColleges() {
  return (
    <section className="apc-intern-section" style={{ color: '#000000' }}>
      <div style={{ backgroundColor: '#d9b2b2', padding: '2.5rem 1.5rem' }}>
        <h2
          style={{
            fontFamily: mockFont,
            color: '#000000',
            fontWeight: 400,
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            margin: '0 0 0.75rem',
            lineHeight: 1.2,
          }}
        >
          Partnering Colleges and Universities
        </h2>
        <p
          style={{
            fontFamily: mockFont,
            color: '#000000',
            textAlign: 'center',
            maxWidth: '48rem',
            margin: '0 auto',
            fontSize: '0.95rem',
          }}
        >
          The APC partners with colleges and universities to connect talented students with
          hands-on industry opportunities.
        </p>
      </div>
      <div style={{ backgroundColor: '#ffffff', padding: '2.5rem 1.5rem' }}>
        <div className="apc-intern-partners-grid">
          {PARTNER_PLACEHOLDERS.map((name) => (
            <div
              key={name}
              style={{
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e8e8e8',
                border: '1px dashed #9a9a9a',
                padding: '0.5rem 0.75rem',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  fontFamily: mockFont,
                  color: '#666666',
                  fontSize: '0.75rem',
                  lineHeight: 1.3,
                }}
              >
                {name}
                <br />
                logo placeholder
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

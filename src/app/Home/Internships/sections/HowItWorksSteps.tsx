import React, { type ReactNode } from 'react';
import './internshipsSections.css';

export type HowItWorksStep = {
  number: string;
  title: string;
  description: string;
  extra?: ReactNode;
};

type HowItWorksStepsProps = {
  heading?: string;
  subheading: string;
  steps: HowItWorksStep[];
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

function StepCard({
  step,
  height,
}: {
  step: HowItWorksStep;
  height?: number;
}) {
  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '1.5rem 0.75rem 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: height,
        height,
      }}
    >
      <p
        style={{
          fontFamily: mockFont,
          color: '#000000',
          fontWeight: 600,
          fontSize: '1.05rem',
          lineHeight: 1.25,
          margin: '0 0 0.5rem',
        }}
      >
        {step.number} {step.title}
      </p>
      <p
        style={{
          fontFamily: mockFont,
          color: '#000000',
          fontSize: '0.85rem',
          lineHeight: 1.35,
          margin: 0,
        }}
      >
        {step.description}
      </p>
      {step.extra ? (
        <div style={{ marginTop: 'auto', padding: '0.75rem 0.25rem 1.25rem', textAlign: 'left' }}>
          {step.extra}
        </div>
      ) : null}
    </article>
  );
}

export default function HowItWorksSteps({
  heading = 'How it Works',
  subheading,
  steps,
}: HowItWorksStepsProps) {
  return (
    <section
      className="apc-intern-section"
      style={{ backgroundColor: '#9E1B32', padding: '3rem 1.5rem 0' }}
    >
      <h2
        style={{
          fontFamily: mockFont,
          color: '#ffffff',
          fontWeight: 400,
          textAlign: 'center',
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          margin: '0 0 0.75rem',
          lineHeight: 1.2,
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          fontFamily: mockFont,
          color: '#ffffff',
          textAlign: 'center',
          maxWidth: '48rem',
          margin: '0 auto 2.5rem',
          fontSize: '0.95rem',
        }}
      >
        {subheading}
      </p>

      <div className="apc-intern-steps-mobile">
        {steps.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </div>

      <div className="apc-intern-steps-desktop">
        {steps.map((step, index) => (
          <StepCard key={step.number} step={step} height={240 + index * 64} />
        ))}
      </div>
    </section>
  );
}

export function InternshipGuidelines() {
  return (
    <div style={{ color: '#000000' }}>
      <p
        style={{
          fontFamily: mockFont,
          color: '#000000',
          fontWeight: 600,
          fontSize: '0.875rem',
          margin: '0 0 0.25rem',
        }}
      >
        Internship Guidelines:
      </p>
      <ul
        style={{
          fontFamily: mockFont,
          color: '#000000',
          listStyleType: 'disc',
          paddingLeft: '1.25rem',
          margin: 0,
          fontSize: '0.75rem',
          lineHeight: 1.35,
        }}
      >
        <li>Fall &amp; Spring: Up to 20 hours per week</li>
        <li>Summer: 40 hours per week</li>
        <li>All Internships are paid!</li>
      </ul>
    </div>
  );
}

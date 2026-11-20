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
  index,
  stepped,
}: {
  step: HowItWorksStep;
  index: number;
  stepped?: boolean;
}) {
  // Explicit staircase; card 04 is the average of cards 03 and 05
  const stepMinHeightsRem = [10.75, 12.75, 14.75, 16.875, 19];
  const bottomPad = '0.85rem';

  return (
    <article
      className="apc-intern-step-card"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: `1.05rem 0.95rem ${step.extra ? '0' : bottomPad}`,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        boxSizing: 'border-box',
        minHeight: stepped ? `${stepMinHeightsRem[index]}rem` : undefined,
      }}
    >
      <div style={{ flexShrink: 0, width: '100%' }}>
        <p
          style={{
            fontFamily: mockFont,
            fontWeight: 700,
            fontSize: '1.5rem',
            lineHeight: 1.1,
            color: '#9E1B32',
            margin: '0 0 0.3rem',
          }}
        >
          {step.number}
        </p>
        <p
          style={{
            fontFamily: mockFont,
            fontWeight: 700,
            fontSize: '1.12rem',
            lineHeight: 1.25,
            color: '#000000',
            margin: 0,
          }}
        >
          {step.title}
        </p>
      </div>

      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0.55rem 0.15rem',
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            fontFamily: mockFont,
            color: '#000000',
            fontSize: '0.98rem',
            lineHeight: 1.4,
            margin: 0,
            maxWidth: '17rem',
          }}
        >
          {step.description}
        </p>
      </div>

      {step.extra ? (
        <div
          style={{
            flexShrink: 0,
            width: '100%',
            padding: `0.15rem 0.15rem ${bottomPad}`,
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
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
      style={{ backgroundColor: '#9E1B32', padding: '2.5rem 1.5rem 1.75rem' }}
    >
      <h2
        style={{
          fontFamily: mockFont,
          color: '#ffffff',
          fontWeight: 400,
          textAlign: 'center',
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          margin: '0 0 0.55rem',
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
          margin: '0 auto 1.75rem',
          fontSize: '0.95rem',
        }}
      >
        {subheading}
      </p>

      <div className="apc-intern-steps-mobile">
        {steps.map((step, index) => (
          <StepCard key={step.number} step={step} index={index} />
        ))}
      </div>

      <div className="apc-intern-steps-desktop">
        {steps.map((step, index) => (
          <StepCard key={step.number} step={step} index={index} stepped />
        ))}
      </div>
    </section>
  );
}

export function InternshipGuidelines({
  variant = 'guidelines',
}: {
  variant?: 'guidelines' | 'schedules';
}) {
  const isSchedules = variant === 'schedules';
  return (
    <div style={{ color: '#000000', textAlign: 'center', fontFamily: mockFont }}>
      <p
        style={{
          fontFamily: mockFont,
          color: '#000000',
          fontWeight: 400,
          fontSize: '0.98rem',
          lineHeight: 1.4,
          margin: '0 0 0.25rem',
        }}
      >
        {isSchedules ? 'Internship Schedules:' : 'Internship Guidelines:'}
      </p>
      <ul
        style={{
          fontFamily: mockFont,
          color: '#000000',
          listStyleType: 'disc',
          listStylePosition: 'inside',
          paddingLeft: 0,
          margin: 0,
          fontSize: '0.98rem',
          lineHeight: 1.4,
          textAlign: 'center',
        }}
      >
        <li>
          Fall &amp; Spring: {isSchedules ? '20 hours per week' : 'Up to 20 hours per week'}
        </li>
        <li>Summer: 40 hours per week</li>
      </ul>
    </div>
  );
}

export function ApplyHereLink() {
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <a
        href="/Apply"
        style={{
          fontFamily: mockFont,
          color: '#9E1B32',
          fontSize: '0.95rem',
          fontWeight: 600,
          textDecoration: 'underline',
        }}
      >
        Apply Here
      </a>
    </div>
  );
}

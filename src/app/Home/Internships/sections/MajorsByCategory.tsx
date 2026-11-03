import React, { type ReactNode } from 'react';
import { BriefcaseIcon, GearIcon, LightbulbIcon, MonitorIcon } from './icons';
import './internshipsSections.css';

type MajorCategory = {
  title: string;
  majors: string[];
  icon: ReactNode;
};

const CATEGORIES: MajorCategory[] = [
  {
    title: 'Engineering',
    icon: <GearIcon className="h-10 w-10" />,
    majors: [
      'Mechanical',
      'Aerospace',
      'Electrical',
      'Industrial & System Engineering',
    ],
  },
  {
    title: 'Business',
    icon: <BriefcaseIcon className="h-10 w-10" />,
    majors: [
      'Accounting',
      'Finance',
      'Business Management',
      'Marketing',
      'Operations Management',
    ],
  },
  {
    title: 'Technology',
    icon: <MonitorIcon className="h-10 w-10" />,
    majors: ['Computer Science', 'Management Information Systems'],
  },
  {
    title: 'Creative & Communications',
    icon: <LightbulbIcon className="h-10 w-10" />,
    majors: ['Communications', 'Public Relations', 'Advertising', 'Studio Art'],
  },
];

type MajorsByCategoryProps = {
  heading: string;
  subheading: string;
  footerNote: string;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';

export default function MajorsByCategory({
  heading,
  subheading,
  footerNote,
}: MajorsByCategoryProps) {
  return (
    <section
      className="apc-intern-section"
      style={{ backgroundColor: '#ffffff', color: '#000000', padding: '3rem 1.5rem' }}
    >
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
        {heading}
      </h2>
      <p
        style={{
          fontFamily: mockFont,
          color: '#000000',
          textAlign: 'center',
          maxWidth: '48rem',
          margin: '0 auto 2.5rem',
          fontSize: '0.95rem',
        }}
      >
        {subheading}
      </p>
      <div className="apc-intern-majors-grid">
        {CATEGORIES.map((category) => (
          <article
            key={category.title}
            style={{
              backgroundColor: '#e4e4e4',
              color: '#000000',
              minHeight: 280,
              padding: '2rem 1rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                color: '#9E1B32',
                marginBottom: '0.75rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {category.icon}
            </div>
            <h3
              style={{
                fontFamily: mockFont,
                color: '#000000',
                fontWeight: 600,
                fontSize: '1.2rem',
                margin: '0 0 1rem',
              }}
            >
              {category.title}
            </h3>
            <ul
              style={{
                fontFamily: mockFont,
                color: '#000000',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.95rem',
              }}
            >
              {category.majors.map((major) => (
                <li key={major} style={{ marginBottom: 4 }}>
                  {major}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p
        style={{
          fontFamily: mockFont,
          color: '#000000',
          textAlign: 'center',
          fontStyle: 'italic',
          marginTop: '2rem',
          fontSize: '0.95rem',
        }}
      >
        {footerNote}
      </p>
    </section>
  );
}

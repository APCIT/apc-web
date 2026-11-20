import React, { type ReactNode } from 'react';
import { AtomIcon, BriefcaseIcon, GearIcon, LightbulbIcon, MonitorIcon } from './icons';
import './internshipsSections.css';

type MajorCategory = {
  title: string;
  majors: string[];
  icon: ReactNode;
};

const CATEGORIES: MajorCategory[] = [
  {
    title: 'Engineering',
    icon: <GearIcon />,
    majors: [
      'Mechanical',
      'Aerospace',
      'Electrical',
      'Industrial & System',
      'Chemical',
      'Civil',
      'Metallurgical',
    ],
  },
  {
    title: 'Business',
    icon: <BriefcaseIcon />,
    majors: [
      'Accounting',
      'Finance',
      'Business Management',
      'Marketing',
      'Operations Management',
      'General',
    ],
  },
  {
    title: 'Science',
    icon: <AtomIcon />,
    majors: ['Chemistry', 'Psychology', 'Public Health', 'Environmental'],
  },
  {
    title: 'Marketing & Communications',
    icon: <LightbulbIcon />,
    majors: ['Communications', 'Public Relations', 'Advertising', 'Studio Art'],
  },
  {
    title: 'Technology',
    icon: <MonitorIcon />,
    majors: [
      'Computer Science',
      'Management Information Systems',
      'Cybersecurity',
      'Data Sciences',
    ],
  },
];

type MajorsByCategoryProps = {
  heading: string;
  subheading: string;
  footerNote: string;
  footerItalic?: boolean;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';
const bodyFont = 'proxima-nova, Roboto, Arial, sans-serif';

export default function MajorsByCategory({
  heading,
  subheading,
  footerNote,
  footerItalic = true,
}: MajorsByCategoryProps) {
  return (
    <section
      className="apc-intern-section"
      style={{ backgroundColor: '#ffffff', color: '#000000', padding: '2.5rem 1.5rem 1.75rem' }}
    >
      <h2
        style={{
          fontFamily: mockFont,
          color: '#000000',
          fontWeight: 400,
          textAlign: 'center',
          fontSize: 'clamp(1.95rem, 3.2vw, 2.5rem)',
          margin: '0 0 0.65rem',
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
          maxWidth: '52rem',
          margin: '0 auto 1.75rem',
          fontSize: '1.05rem',
          lineHeight: 1.4,
        }}
      >
        {subheading}
      </p>
      <div className="apc-intern-majors-grid">
        {CATEGORIES.map((category) => (
          <article key={category.title} className="apc-intern-major-card">
            <div className="apc-intern-major-card-header">
              <div className="apc-intern-major-card-icon">
                <div style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
                  {category.icon}
                </div>
              </div>
              <h3
                style={{
                  fontFamily: mockFont,
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {category.title}
              </h3>
            </div>
            <ul className="apc-intern-major-card-list" style={{ fontFamily: bodyFont }}>
              {category.majors.map((major) => (
                <li key={major}>{major}</li>
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
          fontStyle: footerItalic ? 'italic' : 'normal',
          marginTop: '1rem',
          marginBottom: 0,
          fontSize: '0.95rem',
        }}
      >
        {footerNote}
      </p>
    </section>
  );
}

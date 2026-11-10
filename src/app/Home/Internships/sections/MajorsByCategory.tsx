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
    majors: ['Computer Science', 'Management Information Systems'],
  },
];

type MajorsByCategoryProps = {
  heading: string;
  subheading: string;
  footerNote: string;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';
const bodyFont = 'proxima-nova, Roboto, Arial, sans-serif';

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
          maxWidth: '52rem',
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
              minHeight: 300,
              padding: '1.5rem 1.1rem 1.75rem',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                color: '#9E1B32',
                marginBottom: '0.65rem',
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
                fontWeight: 700,
                fontSize: '1.15rem',
                margin: '0 0 0.85rem',
                textAlign: 'center',
                lineHeight: 1.25,
              }}
            >
              {category.title}
            </h3>
            <ul
              style={{
                fontFamily: bodyFont,
                color: '#000000',
                listStyleType: 'disc',
                paddingLeft: '1.2rem',
                margin: 0,
                fontSize: '0.92rem',
                lineHeight: 1.45,
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

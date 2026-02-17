'use client';

import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

type PastNewsletterEntry = {
  title: string;
  href: string;
  cta: string;
};

const pastNewsletterEntries: PastNewsletterEntry[] = [
  { title: 'Fall 2020', href: 'https://conta.cc/3fb1tlt', cta: 'View Newsletter' },
  { title: 'Summer 2019', href: 'https://myemail.constantcontact.com/Alabama-Productivity-Center-2019-Summer-Newsletter.html?soid=1127193424690&aid=orImybqVa2k', cta: 'View Newsletter' },
  { title: 'Spring 2019', href: 'https://myemail.constantcontact.com/Alabama-Productivity-Center-2019-Winter-Newsletter.html?soid=1127193424690&aid=WINGX0cjTmM', cta: 'View Newsletter' },
  { title: 'Summer 2018', href: 'https://myemail.constantcontact.com/Alabama-Productivity-Center-2018-Summer-Newsletter.html?soid=1127193424690&aid=lyogQIkOMNs', cta: 'View Newsletter' },
  { title: 'Spring 2018', href: 'https://myemail.constantcontact.com/Alabama-Productivity-Center-2017-Fall-Newsletter.html?soid=1127193424690&aid=guqEvlztBOs', cta: 'View Newsletter' },
  { title: 'Fall 2017', href: 'https://myemail.constantcontact.com/Alabama-Productivity-Center-2017-Fall-Newsletter.html?soid=1127193424690&aid=BextAa7vGqM', cta: 'View Newsletter' },
  { title: 'Summer 2017', href: 'https://myemail.constantcontact.com/Alabama-Productivity-Center-Summer-Newsletter.html?soid=1127193424690&aid=HgWaz0scwCE', cta: 'View Newsletter' },
  { title: 'Spring 2017', href: 'https://myemail.constantcontact.com/2017-Spring-Semester-End-Newsletter.html?soid=1127193424690&aid=LKvSqfwThYA', cta: 'View Newsletter' },
];

const newsletterTitleStyle: CSSProperties = {
  fontSize: 'clamp(1.25rem, 4vw, 3em)',
  color: '#7a808a',
  fontFamily: 'Roboto, sans-serif',
  margin: 0,
};

const newsletterRowStyle: CSSProperties = {
  paddingTop: '40px',
  paddingBottom: '40px',
  minHeight: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

export default function PastNewslettersPage() {
  return (
    <div className="w-full bg-white text-black" style={{ overflowX: 'hidden' }}>
      <HeadingIntroBanner
        title="Past Newsletters"
        backgroundImage="/images/Headers/NewsPages.jpeg"
        backgroundPosition="bottom"
        height="20em"
      />

      {/* Newsletters list - same design as Newsletters page left column */}
      <section className="w-full bg-white" style={{ overflowX: 'hidden', boxSizing: 'border-box' }}>
        <div className="w-full max-w-4xl mx-auto" style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '24px', paddingBottom: '48px', boxSizing: 'border-box', maxWidth: '100%' }}>
          {pastNewsletterEntries.map((entry) => (
            <div
              key={entry.title}
              className="newsletter-row"
              style={{
                ...newsletterRowStyle,
                transitionDuration: '0.6s',
                backgroundColor: 'white',
              }}
            >
              <div className="flex flex-row items-center justify-between w-full gap-4" style={{ minWidth: 0 }}>
                <p style={{ ...newsletterTitleStyle, flex: '1 1 auto', minWidth: 0 }}>{entry.title}</p>
                <div className="flex justify-end flex-shrink-0">
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer"
                    className="homepageButton boxshadowEffect"
                    style={{ color: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    {entry.cta}
                  </a>
                </div>
              </div>
              <hr
                style={{
                  width: '97%',
                  color: '#000',
                  height: '1px',
                  backgroundColor: '#000',
                  marginTop: '24px',
                  marginBottom: 0,
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const ua = {
  color: {
    textDefault: '#35363B',
    textAlt: '#4A4C54',
    textSubtle: '#757C88',
    primary: '#9E1B32',
    primaryHover: '#70202C',
    surface: '#FFFFFF',
    element: '#F2F3F4',
    chip: '#DFE2E5',
    neutral800: '#35363B',
  },
  font: {
    heading: 'proxima-nova, sans-serif',
    body: 'proxima-nova, sans-serif',
  },
  space: {
    1: '0.5rem',
    2: '1rem',
    4: '2rem',
    section: '4rem',
    gutter: '1rem',
  },
};

type NewsletterEntry = {
  title: string;
  href: string;
  cta: string;
  isExternal?: boolean;
};

type NewsArticle = {
  title: string;
  href: string;
};

const newsletterEntries: NewsletterEntry[] = [
  {
    title: 'July 2026',
    href: 'https://t.e2ma.net/webview/1zxrzr/4694f140233ca30bde0184477107f027',
    cta: 'View Newsletter',
    isExternal: true,
  },
  {
    title: 'June 2026',
    href: 'https://t.e2ma.net/webview/1jx0xr/38070c206d36976aa9f25e3752b2a0c3?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnbnu4Ohz2JwXkYQSwTjd2T_WMLcVhUxcdWBpRILzQKZ7eJmoaAGbFR4RjCRg_aem_n_VZyvzF-0Vt-4UBZJx2IA',
    cta: 'View Newsletter',
    isExternal: true,
  },
  {
    title: 'Fall 2025',
    href: 'https://apcstorage.blob.core.windows.net/staff-only-materials/APC Fall 2025 Newsletter .pdf',
    cta: 'View Newsletter',
    isExternal: true,
  },
  { 
    title: 'Spring 2025',
    href:'https://apcstorage.blob.core.windows.net/staff-only-materials/APC Spring 2025 Newsletter.pdf',
    cta: 'View Newsletter',
    isExternal: true
  },
  {
    title: 'Fall 2023',
    href: 'https://myemail.constantcontact.com/Alabama-Productivity-Center-2023-Fall-Newsletter.html?soid=1127193424690&aid=5J0Jh5gn764',
    cta: 'View Newsletter',
    isExternal: true
  },
  {
    title: 'Spring 2023',
    href: 'https://conta.cc/3WU74Ad',
    cta: 'View Newsletter',
    isExternal: true
  },
  {
    title: 'Summer 2022',
    href: 'https://conta.cc/3qvnnYa',
    cta: 'View Newsletter',
    isExternal: true
  },
  {
    title: 'Spring 2022',
    href: 'https://conta.cc/3hM8w41',
    cta: 'View Newsletter',
    isExternal: true
  },
  {
    title: 'Fall 2021',
    href: 'https://conta.cc/3i6enSp',
    cta: 'View Newsletter',
    isExternal: true
  },
  {
    title: 'Spring 2021',
    href: 'https://conta.cc/397VzgY',
    cta: 'View Newsletter',
    isExternal: true
  },
  {
    title: 'Past News',
    href: '/Home/PastNewsletters',
    cta: 'Past Newsletters'
  }
];

const newsArticles: NewsArticle[] = [
  {
    title: 'UAH, APC, Mazda Toyota collaborating on workforce training, retention',
    href: 'https://www.uah.edu/ahs/news/19270-uah-interdisciplinary-collaboration-with-mazda-toyota-manufacturing-seeks-to-drive-innovation-in-workforce-development'
  },
  {
    title: 'One program connects students + companies across the state—how to get involved',
    href: 'https://bhamnow.com/2023/08/10/alabama-internship-students-make-difference/'
  },
  {
    title: 'Internship Program Builds Results for BLOX',
    href: 'https://www.nist.gov/mep/successstories/2023/internship-program-builds-results-blox'
  },
  {
    title: '3D printers coming to the rescue in the need for PPE',
    href: 'https://abc3340.com/news/coronavirus/3d-printers-coming-to-the-aid-when-it-comes-to-the-need-for-ppe'
  },
  {
    title: '3-D printers join race to produce face shields for healthcare workers',
    href: 'https://www.madeinalabama.com/2020/04/3-d-printers-join-race-to-produce-face-shields-for-healthcare-workers/?utm_source=facebook,%20twitter&utm_medium=social&utm_campaign=3-d_printed_face_shields'
  },
  {
    title: 'UA Helping Fabricate Protection for Health Care Workers',
    href: 'https://news.ua.edu/2020/04/ua-helping-fabricate-protection-for-health-care-workers/'
  },
  {
    title: 'Alabama Power working with UAB, Alabama Productivity Center to aid health care workers',
    href: 'https://www.alreporter.com/2020/04/04/alabama-power-working-with-uab-alabama-productivity-center-to-aid-health-care-workers/'
  },
  {
    title: 'Alabama Power, UA, UAB join race to produce face shields for health care workers',
    href: 'https://www.alabamanewscenter.com/2020/04/07/alabama-power-ua-uab-join-race-to-produce-face-shields-for-health-care-workers/?utm_content=125066959&utm_medium=social&utm_source=twitter&hss_channel=tw-106360602'
  }
];

const newsletterTitleStyle: CSSProperties = {
  fontSize: 'clamp(1.5rem, 2vw, 2.25rem)',
  lineHeight: 1.2,
  color: '#FFFFFF',
  fontFamily: 'proxima-nova, Arial, sans-serif',
  margin: 0,
  fontWeight: 700,
};

const newsletterRowStyle: CSSProperties = {
  backgroundColor: '#212124',
  border: '1px solid #35363B',
  borderRadius: '12px',
  boxShadow: '0 10px 24px rgba(0,0,0,.14)',
  padding: '28px 32px',
  minHeight: '110px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  maxWidth: '95%',
  margin: '0 auto 1.25rem auto',
};

const buttonSectionStyle: CSSProperties = {
  backgroundColor: '#212124',
  border: '1px solid #35363B',
  borderRadius: '12px',
  boxShadow: '0 10px 24px rgba(0,0,0,.14)',
  padding: '28px 32px',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '110px',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.25rem',
};

const newsArticleContainerStyle: CSSProperties = {
  width: '100%',
  minHeight: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'stretch',
  height: '100%'
};

const buttonBarStyle: CSSProperties = {
  color: '#E87C90',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: '1.05rem',
  lineHeight: 1.5,
  fontFamily: 'proxima-nova, Arial, sans-serif',
  fontWeight: 700,
  textDecoration: 'underline',
  boxSizing: 'border-box',
};

export default function NewslettersPage() {
  return (
  <div className="w-full" style={{ backgroundColor: '#F2F3F4', overflowX: 'hidden' }}>
    <HeadingIntroBanner
      title="News"
      backgroundImage="/images/Headers/NewsPages.jpeg"
      backgroundPosition="bottom"
      height="20em"
    />

    {/* Section headers */}
    <section className="w-full" style={{ backgroundColor: '#F2F3F4', color: '#35363B', overflowX: 'hidden' }}>
      <div className="flex w-full" style={{ maxWidth: '100%' }}>
        <div
          className="w-1/2 text-center"
          style={{
            paddingTop: '3.5rem',
            paddingBottom: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: '3vw', fontFamily: 'proxima-nova, sans-serif', margin: 0 }}>
            Newsletters
          </h2>

          <div
            style={{
              width: '70px',
              height: '4px',
              backgroundColor: '#9E1B32',
              margin: '1rem auto 0',
              borderRadius: '999px',
            }}
          />
        </div>

        <div
          className="w-1/2 text-center"
          style={{
            paddingTop: '3.5rem',
            paddingBottom: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: '3vw', fontFamily: 'proxima-nova, sans-serif', margin: 0 }}>
            APC in the News
          </h2>

          <div
            style={{
              width: '70px',
              height: '4px',
              backgroundColor: '#9E1B32',
              margin: '1rem auto 0',
              borderRadius: '999px',
            }}
          />
        </div>
      </div>
    </section>

    {/* Main content */}
    <section className="w-full" style={{ backgroundColor: '#F2F3F4', overflowX: 'hidden' }}>
      <div className="flex w-full" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        {/* Left column - newsletters */}
        <div
          className="w-1/2"
          style={{
            backgroundColor: '#F2F3F4',
            paddingLeft: ua.space[4],
            paddingRight: ua.space[4],
            paddingBottom: ua.space[4],
          }}
        >
          {newsletterEntries.map((entry) => (
            <div
              key={entry.title}
              className="newsletter-row"
              style={{
                ...newsletterRowStyle,
                transitionDuration: '0.6s',
              }}
            >
              <div className="flex flex-row items-center justify-between w-full">
                <p style={newsletterTitleStyle}>{entry.title}</p>

                <div className="flex justify-end">
                  {entry.isExternal ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="homepageButton boxshadowEffect"
                      style={{ color: 'white', textDecoration: 'none' }}
                    >
                      {entry.cta}
                    </a>
                  ) : (
                    <Link
                      href={entry.href}
                      className="homepageButton boxshadowEffect"
                      style={{ color: 'white', textDecoration: 'none' }}
                    >
                      {entry.cta}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column - news articles */}
        <div
          className="w-1/2 flex flex-col"
          style={{
            backgroundColor: '#F2F3F4',
            paddingLeft: ua.space[4],
            paddingRight: ua.space[4],
          }}
        >
          {newsArticles.slice(0, newsletterEntries.length).map((article) => (
            <div key={article.title} className="news-article-row" style={newsArticleContainerStyle}>
              <div style={buttonSectionStyle}>
                <a
                  href={article.href}
                  target="_blank"
                  rel="noreferrer"
                  className="button-bar"
                  style={buttonBarStyle}
                >
                  {article.title}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Newsletter Signup CTA */}
    <section
      style={{
        backgroundColor: '#FFFFFF',
        padding: '4rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
           fontSize: '2rem', fontFamily: 'proxima-nova, sans-serif', margin: 0, color: '#35363B'
        }}
      >
        Want to Stay Updated?
      </h2>

      <div
        style={{
          width: '70px',
          height: '4px',
          backgroundColor: '#9E1B32',
          margin: '0 auto 2rem',
          borderRadius: '999px',
        }}
      />

      <a
        href="https://app.e2ma.net/app2/audience/signup/2096667/2062159/"
        target="_blank"
        rel="noreferrer"
        className="contact-submit"
        style={{
          display: 'inline-block',
          textDecoration: 'none',
          maxWidth: '320px',
        }}
      >
        Sign Up for Our Newsletter
      </a>
    </section>
  </div>
  );
}

'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import Script from 'next/script';
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
  color: '#35363B',
  fontFamily: 'proxima-nova, Arial, sans-serif',
  margin: 0,
  fontWeight: 700,
};

const newsletterRowStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '4px solid #9E1B32',
  borderRadius: '32px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  padding: '28px 36px',
  minHeight: '110px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  marginTop: ua.space[2],
  marginBottom: ua.space[2],
  maxWidth: '95%',
  margin: '0 auto 0.75rem auto',
};

const buttonSectionStyle: CSSProperties = {
  backgroundColor: '#9e1b32',
  borderRadius: '32px',
  padding: '0.25rem',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
  marginTop: ua.space[2],
  marginBottom: ua.space[2],
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
  backgroundColor: '#ffffff',
  color: '#9e1b32',
  padding: '16px 20px',
  width: '100%',
  borderRadius: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: 'clamp(0.9rem, 1.2vw, 1.3rem)',
  lineHeight: 1.4,
  fontFamily: 'proxima-nova, Arial, sans-serif',
  fontWeight: 600,
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  height: '100%',
  boxSizing: 'border-box'
};

export default function NewslettersPage() {
  return (
    <div className="w-full" style={{ backgroundColor: '#DFE2E5',  overflowX: 'hidden' }}>
      <HeadingIntroBanner
        title="News"
        backgroundImage="/images/Headers/NewsPages.jpeg"
        backgroundPosition="bottom"
        height="20em"
      />

      {/* Section headers */}
      <section className="w-full text-white" style={{ backgroundColor: '#DFE2E5',  color: '#35363B', overflowX: 'hidden' }}>
        <div className="flex w-full" style={{ maxWidth: '100%' }}>
          <div className="w-1/2 text-center" style={{ height: '14vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2
              className="text-white font-bold"
              style={{ fontSize: '3vw', fontFamily: 'proxima-nova, Arial, sans-serif' }}
            >
              <>Newsletters</>
            </h2>
          </div>
          <div className="w-1/2 text-center" style={{ height: '14vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2
              className="text-white font-bold"
              style={{ fontSize: '3vw', fontFamily: 'proxima-nova, Arial, sans-serif' }}
            >
              <>APC in the News</>
            </h2>
          </div>
        </div>
      </section>

            {/* Newsletter Signup CTA */}
      <section
        className="w-full"
        style={{
          backgroundColor: '#DFE2E5',
          paddingBottom: '2rem',
          textAlign: 'center'
        }}
      >
        <a
          href="https://app.e2ma.net/app2/audience/signup/2096667/2062159/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            backgroundColor: '#9E1B32',
            color: '#FFFFFF',
            padding: '0.85rem 1.75rem',
            borderRadius: '999px',
            fontFamily: 'proxima-nova, Arial, sans-serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease'
          }}
        >
          Sign Up for Our Newsletter!
        </a>
      </section>

      {/* Main content */}
      <section className="w-full" style={{ backgroundColor: '#DFE2E5', overflowX: 'hidden' }}>
        <div className="flex w-full" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          {/* Left column - newsletters */}
          <div className="w-1/2" style={{backgroundColor: '#DFE2E5', paddingLeft: ua.space[4], paddingRight: ua.space[4], paddingBottom: ua.space[4] }}>
            {newsletterEntries.map((entry) => (
              <div
                key={entry.title}
                className="newsletter-row"
                style={{ 
                  ...newsletterRowStyle, 
                  transitionDuration: '0.6s', 
                  backgroundColor: 'white'
                }}
              >
                  <div className="flex flex-row items-center justify-between w-full">
                    <p style={newsletterTitleStyle}>
                      {entry.title}
                    </p>
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
          <div className="w-1/2 flex flex-col" style={{ backgroundColor: '#DFE2E5', paddingLeft: ua.space[4], paddingRight: ua.space[4] }}>
            {newsArticles.slice(0, newsletterEntries.length).map((article) => (
              <div 
                key={article.title} 
                className="news-article-row"
                style={newsArticleContainerStyle}
              >
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

      {/* Newsletter Signup Form */}
      <section className="w-full bg-white" style={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div className="w-full" style={{ padding: '24px', boxSizing: 'border-box', maxWidth: '100%', overflow: 'hidden' }}>
          {/* Custom CSS for Constant Contact Form */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .ctct-inline-form {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                padding-right: 0 !important;
                margin-right: 0 !important;
              }
              .ctct-inline-form input[type="email"],
              .ctct-inline-form input[type="text"] {
                width: 25% !important;
                max-width: 25% !important;
              }
              .ctct-inline-form button[type="submit"],
              .ctct-inline-form input[type="submit"] {
                width: 100% !important;
                max-width: 100% !important;
              }
              @media (max-width: 640px) {
                .ctct-inline-form input,
                .ctct-inline-form input[type="email"],
                .ctct-inline-form input[type="text"] {
                  width: 100% !important;
                  max-width: 100% !important;
                  min-height: 50px !important;
                  padding: 15px !important;
                  font-size: 16px !important;
                  box-sizing: border-box !important;
                }
              }
            `
          }} />
          
          {/* Constant Contact config – run on client navigation */}
          <Script id="ctct-config" strategy="afterInteractive">
            {`window._ctct_m = "b6f79c47d6d4b7882fda66111f433ca1";`}
          </Script>
          
          {/* Constant Contact Inline Form */}
          <div className="ctct-inline-form" data-form-id="2769e6e6-8eee-455d-a8b5-cdb2ad3d73e3"></div>
          
          {/* Constant Contact Signup Form Script */}
          <Script
            id="signupScript"
            src="https://static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js"
            strategy="afterInteractive"
          />
        </div>
      </section>
    </div>
  );
}

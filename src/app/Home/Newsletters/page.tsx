'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

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
  fontSize: '3em',
  color: '#7a808a',
  fontFamily: 'Roboto, sans-serif',
  margin: 0
};

const newsletterRowStyle: CSSProperties = {
  paddingTop: '40px',
  paddingBottom: '40px',
  minHeight: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
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
  marginTop: '10px',
  marginBottom: '10px'
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
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  height: '100%',
  boxSizing: 'border-box'
};

export default function NewslettersPage() {
  return (
    <div className="w-full bg-white text-black" style={{ overflowX: 'hidden' }}>
      <HeadingIntroBanner
        title="News"
        backgroundImage="/images/Headers/NewsPages.jpeg"
        backgroundPosition="bottom"
        height="20em"
      />

      {/* Section headers */}
      <section className="w-full bg-[#3d3d3d] text-white" style={{ overflowX: 'hidden' }}>
        <div className="flex w-full" style={{ maxWidth: '100%' }}>
          <div className="w-1/2 text-center" style={{ height: '14vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2
              className="text-white font-bold"
              style={{ fontSize: '3vw', fontFamily: 'Roboto, sans-serif' }}
            >
              <strong>Newsletters</strong>
            </h2>
          </div>
          <div className="w-1/2 text-center" style={{ height: '14vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2
              className="text-white font-bold"
              style={{ fontSize: '3vw', fontFamily: 'Roboto, sans-serif' }}
            >
              <strong>APC in the News</strong>
            </h2>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="w-full bg-[#9e1b32]" style={{ overflowX: 'hidden' }}>
        <div className="flex w-full" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          {/* Left column - newsletters */}
          <div className="w-1/2 text-black" style={{ marginLeft: '-30px', backgroundColor: 'white', paddingLeft: '30px', paddingRight: '30px' }}>
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
                  <hr
                    style={{
                      width: '97%',
                      color: '#000',
                      height: '1px',
                      backgroundColor: '#000',
                      marginTop: '24px',
                      marginBottom: 0
                    }}
                  />
                </div>
              ))}
          </div>

          {/* Right column - news articles */}
          <div className="w-1/2 bg-[#9e1b32] flex flex-col" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
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

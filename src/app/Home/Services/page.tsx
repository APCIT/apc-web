'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';
import { CATALOG_PDF_EMBED_URL, professionalServices } from '@/data/professionalServices';

const BUTTON_BG = '#9E1B32';
const BUTTON_TEXT = '#ffffff';

export default function ServicesPage() {
  return (
    <div className="services-page w-full overflow-x-hidden">
      <HeadingIntroBanner
        title="Professional Services"
        backgroundImage="/images/factory3.jpg"
      />

      {/* Four service columns */}
      <section
        style={{
          backgroundColor: '#F2F3F4',
          width: '100%',
          padding: '3rem 0.75rem 4rem',
        }}
      >
        <div style={{ maxWidth: '1560px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '2.25rem',
              fontWeight: 800,
              textAlign: 'center',
              color: '#212124',
              margin: 0,
            }}
          >
            Our Professional Services
          </h2>

          <div
            style={{
              width: '72px',
              height: '4px',
              backgroundColor: '#9E1B32',
              margin: '1rem auto 2rem',
            }}
          />

          <div className="services-columns-grid">
            {professionalServices.map((category) => {
              const isLight = category.accentTextColor.toLowerCase() !== '#ffffff';
              const bullet = isLight ? '#212124' : '#FFFFFF';
              const line = isLight ? '#212124' : '#FFFFFF';
              return (
                <div
                  key={category.id}
                  className="service-column"
                  style={{
                    backgroundColor: category.accentColor,
                    color: category.accentTextColor,
                  }}
                >
                  <div className="service-column-top">
                    <div className="service-column-icon-wrap">
                      <Image
                        src={category.icon}
                        alt=""
                        width={56}
                        height={56}
                        className="service-column-icon"
                      />
                    </div>

                    <h3
                      className="service-column-title"
                      style={{
                        color: category.accentTextColor,
                      }}
                    >
                      {category.title}
                    </h3>

                    <div
                      style={{
                        width: '64px',
                        height: '3px',
                        backgroundColor: line,
                        margin: '1rem auto 0',
                      }}
                    />
                  </div>

                  <ul className="service-column-list">
                    {category.columnItems.map((item) => (
                      <li key={item.itemId}>
                        <span
                          className="service-column-bullet"
                          style={{ backgroundColor: bullet }}
                          aria-hidden
                        />
                        <Link
                          href={`/Home/ExpandedServices#${item.itemId}`}
                          className="service-column-item-link"
                          style={{ color: category.accentTextColor }}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/Home/ExpandedServices#${category.id}`}
                    className="service-column-cta-link"
                  >
                    <span
                      className="service-column-cta"
                      style={{
                        backgroundColor: BUTTON_BG,
                        color: BUTTON_TEXT,
                      }}
                    >
                      Learn More →
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <div style={{ backgroundColor: '#9E1B32', width: '100%', padding: '5rem 0' }}>
        <div
          style={{
            maxWidth: '1232px',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 2rem',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              flex: '0 0 58.33%',
              minWidth: '300px',
              boxSizing: 'border-box',
              paddingRight: '1.5rem',
            }}
          >
            <h1
              style={{
                fontFamily: 'proxima-nova, sans-serif',
                color: 'white',
                textAlign: 'left',
                fontSize: '2.75rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              PROVIDING THE RIGHT SOLUTIONS FOR YOU
            </h1>
            <hr
              style={{
                width: '140px',
                margin: '0 0 2rem',
                borderColor: '#E87C90',
              }}
            />
            <p
              style={{
                color: 'white',
                fontSize: '1.3rem',
                fontFamily: 'proxima-nova, sans-serif',
                textAlign: 'left',
                lineHeight: '1.4',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
              Advancing economic development in the state of Alabama since 1986, APC works directly
              with businesses, organizations, and government agencies throughout Alabama to increase
              their efficiency, provide cost-saving solutions and improve overall productivity. In
              1996, APC also became part of the National Institute of Standards and Technology for
              the state of Alabama.
            </p>
          </div>

          <div
            style={{
              flex: '0 0 41.67%',
              minWidth: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box',
              paddingRight: '0.5em',
            }}
          >
            <Image
              src="/images/Justin 9.jpg"
              alt="Alabama Productivity Center"
              width={450}
              height={600}
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
                boxShadow: '0 18px 40px rgba(0,0,0,.22)',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Internship Hiring Section */}
      <div style={{ backgroundColor: '#ffffff', width: '100%', padding: '0' }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              flex: '0 0 50%',
              minWidth: '300px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2em',
            }}
          >
            <h2
              style={{
                fontFamily: 'proxima-nova, sans-serif',
                color: 'black',
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              <strong>LOOKING TO HIRE AN INTERN?</strong>
            </h2>
            <Link
              href="/Home/Internships"
              style={{
                width: '100%',
                maxWidth: '450px',
                display: 'flex',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <button type="button" className="contact-submit">
                Learn More
              </button>
            </Link>
          </div>

          <div
            style={{
              flex: '0 0 50%',
              minWidth: '300px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2em',
            }}
          >
            <p
              style={{
                color: 'black',
                fontSize: '1.3em',
                fontFamily: 'proxima-nova, sans-serif',
                lineHeight: '1.6',
                textAlign: 'center',
                maxWidth: '650px',
              }}
            >
              The APC works closely with the internship companies with project development when
              needed. We strive for a Win-Win outcome for the internship program; a benefit to both
              company and the student.
            </p>
          </div>
        </div>
      </div>

      <section className="catalog-download-section" aria-label="Professional services catalog">
        <div className="catalog-download-container">
          <h2 className="catalog-download-title">Our Catalog</h2>
          <div className="catalog-download-line" />
          <div className="catalog-viewer-frame">
            <iframe
              src={CATALOG_PDF_EMBED_URL}
              title="APC Professional Services Catalog 2026"
              className="catalog-viewer-iframe"
              width="100%"
              height="100%"
            />
          </div>
          <div className="catalog-download-actions">
            <a href="/api/catalog/download" className="catalog-download-button">
              Download PDF
            </a>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <h2 className="contact-title">How Can We Help You? We do more, just ask!</h2>
          <div className="contact-title-line" />
          <form className="contact-form" aria-label="Request services">
            <div className="contact-field">
              <label htmlFor="services-contact-name" className="contact-label">
                Name
              </label>
              <input
                type="text"
                id="services-contact-name"
                name="name"
                required
                aria-required="true"
                autoComplete="name"
                className="contact-input"
              />
            </div>
            <div className="contact-row">
              <div className="contact-field">
                <label htmlFor="services-contact-email" className="contact-label">
                  Email
                </label>
                <input
                  type="email"
                  id="services-contact-email"
                  name="email"
                  required
                  aria-required="true"
                  autoComplete="email"
                  className="contact-input"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="services-contact-phone" className="contact-label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="services-contact-phone"
                  name="phone"
                  autoComplete="tel"
                  className="contact-input"
                />
              </div>
            </div>
            <div className="contact-field">
              <label htmlFor="services-contact-company" className="contact-label">
                Company
              </label>
              <input
                type="text"
                id="services-contact-company"
                name="company"
                autoComplete="organization"
                className="contact-input"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="services-contact-services" className="contact-label">
                Services requested
              </label>
              <input
                type="text"
                id="services-contact-services"
                name="services"
                className="contact-input"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="services-contact-message" className="contact-label">
                Message
              </label>
              <textarea
                id="services-contact-message"
                name="message"
                rows={5}
                required
                aria-required="true"
                className="contact-input contact-textarea"
              />
            </div>
            <button type="submit" className="contact-submit">
              Send Message →
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

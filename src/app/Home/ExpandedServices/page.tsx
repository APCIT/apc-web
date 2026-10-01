'use client';

import React, { useState, useEffect } from 'react';
import { Accordion, AccordionItem } from '@heroui/accordion';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';
import {
  professionalServices,
  type ServiceItem,
} from '@/data/professionalServices';

function HoursIcon({ hours }: { hours: number }) {
  return (
    <div className="service-meta-icon" title={`${hours} Hours`}>
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
        <text
          x="18"
          y="22"
          textAnchor="middle"
          fontSize="12"
          fontFamily="proxima-nova, sans-serif"
          fontWeight="700"
          fill="currentColor"
        >
          {hours}
        </text>
      </svg>
      <span>HOURS</span>
    </div>
  );
}

function CertificateIcon() {
  return (
    <div className="service-meta-icon" title="Certificate Awarded">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <rect
          x="8"
          y="6"
          width="20"
          height="16"
          rx="1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 22 L12 30 L18 26 L24 30 L22 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="12" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span>CERTIFICATE</span>
    </div>
  );
}

function ItemContent({ item }: { item: ServiceItem }) {
  return (
    <div className="service-item-body">
      {(item.hours != null || item.certificate) && (
        <div className="service-item-meta">
          {item.hours != null && <HoursIcon hours={item.hours} />}
          {item.certificate && <CertificateIcon />}
        </div>
      )}
      {item.paragraphs.map((paragraph, index) => (
        <p key={`${item.id}-p-${index}`}>{paragraph}</p>
      ))}
      {item.topics && item.topics.length > 0 && (
        <div className="service-item-topics">
          <h4>Topics of Discussion</h4>
          <ul>
            {item.topics.map((topic) => (
              <li key={`${item.id}-${topic}`}>{topic}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ExpandedServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const openFromHash = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) return;

      const category = professionalServices.find((c) => c.id === hash);
      const nestedCategory = professionalServices.find((c) =>
        c.items.some((item) => item.id === hash)
      );

      if (category) {
        setSelectedCategory(new Set([category.id]));
        setSelectedItems({});
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (!element) return;
          const offset =
            element.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }, 100);
        return;
      }

      if (nestedCategory) {
        const item = nestedCategory.items.find((i) => i.id === hash);
        // Open parent first, then nested item once it is mounted
        setSelectedCategory(new Set([nestedCategory.id]));
        setTimeout(() => {
          if (item) {
            setSelectedItems({ [nestedCategory.id]: new Set([item.id]) });
          }
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (!element) return;
            const offset =
              element.getBoundingClientRect().top + window.pageYOffset - 120;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }, 150);
        }, 80);
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <HeadingIntroBanner
        title="Service Details"
        backgroundImage="/images/factory1.jpg"
        backgroundPosition="bottom"
      />

      <div className="expanded-services-wrap">
        <Accordion
          selectionMode="single"
          selectedKeys={selectedCategory}
          onSelectionChange={(keys) => {
            setSelectedCategory(keys as "all" | Set<string>);
            // Closing a category clears its nested open item so only one nested stays meaningful
            if (keys instanceof Set) {
              const openId = [...keys][0];
              setSelectedItems((prev) => {
                if (!openId) return {};
                return prev[openId] ? { [openId]: prev[openId] } : {};
              });
            }
          }}
          className="w-full"
          itemClasses={{
            base: 'serviceDetailsRow',
            trigger: 'py-0 px-0 w-full',
            content: 'py-0 px-0',
            heading: 'py-0 px-0 w-full',
          }}
          showDivider={false}
        >
          {professionalServices.map((category) => (
            <AccordionItem
              key={category.id}
              id={category.id}
              aria-label={category.title}
              indicator={<div />}
              classNames={{
                base: `serviceDetailsRow service-category-${category.id}`,
                trigger: 'py-0 px-0 w-full',
                content: 'py-0 px-0',
                heading: 'py-0 px-0 w-full',
                title: 'w-full',
              }}
              style={
                {
                  backgroundColor: category.accentColor,
                  color: category.accentTextColor,
                  '--service-accent': category.accentColor,
                  '--service-accent-text': category.accentTextColor,
                  '--service-panel-text': category.accentTextColor,
                } as React.CSSProperties
              }
              title={
                <div
                  className="service-category-trigger"
                  style={{
                    backgroundColor: category.accentColor,
                    color: category.accentTextColor,
                  }}
                >
                  <div className="service-category-trigger-inner">
                    <div className="service-category-icon-wrap">
                      <img
                        src={category.icon}
                        alt=""
                        width={48}
                        height={48}
                        className="service-category-icon"
                      />
                    </div>
                    <h2
                      className="service-category-title"
                      style={{ color: category.accentTextColor }}
                    >
                      {category.title}
                    </h2>
                  </div>
                </div>
              }
            >
              <div className="service-category-panel">
                <p className="service-category-intro">{category.introText}</p>

                <Accordion
                  selectionMode="single"
                  selectedKeys={selectedItems[category.id] ?? new Set()}
                  onSelectionChange={(keys) => {
                    const next = keys as Set<string>;
                    setSelectedItems((prev) => ({
                      ...prev,
                      [category.id]: next instanceof Set ? next : new Set(),
                    }));
                  }}
                  className="service-nested-accordion"
                  showDivider={false}
                  itemClasses={{
                    base: 'service-nested-item',
                    trigger: 'service-nested-trigger',
                    content: 'service-nested-content',
                    title: 'service-nested-title',
                    indicator: 'service-nested-indicator',
                  }}
                >
                  {category.items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      id={item.id}
                      aria-label={item.title}
                      title={item.title}
                      HeadingComponent="div"
                    >
                      <ItemContent item={item} />
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <section className="contact-section">
        <div className="contact-container">
          <h2 className="contact-title">How Can We Help You? We do more, just ask!</h2>
          <div className="contact-title-line" />
          <form className="contact-form" aria-label="Request services">
            <div className="contact-field">
              <label htmlFor="expanded-services-contact-name" className="contact-label">
                Name
              </label>
              <input
                type="text"
                id="expanded-services-contact-name"
                name="name"
                required
                aria-required="true"
                autoComplete="name"
                className="contact-input"
              />
            </div>
            <div className="contact-row">
              <div className="contact-field">
                <label htmlFor="expanded-services-contact-email" className="contact-label">
                  Email
                </label>
                <input
                  type="email"
                  id="expanded-services-contact-email"
                  name="email"
                  required
                  aria-required="true"
                  autoComplete="email"
                  className="contact-input"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="expanded-services-contact-phone" className="contact-label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="expanded-services-contact-phone"
                  name="phone"
                  autoComplete="tel"
                  className="contact-input"
                />
              </div>
            </div>
            <div className="contact-field">
              <label htmlFor="expanded-services-contact-company" className="contact-label">
                Company
              </label>
              <input
                type="text"
                id="expanded-services-contact-company"
                name="company"
                autoComplete="organization"
                className="contact-input"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="expanded-services-contact-services" className="contact-label">
                Services requested
              </label>
              <input
                type="text"
                id="expanded-services-contact-services"
                name="services"
                className="contact-input"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="expanded-services-contact-message" className="contact-label">
                Message
              </label>
              <textarea
                id="expanded-services-contact-message"
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

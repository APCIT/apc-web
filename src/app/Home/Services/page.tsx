'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function ServicesPage() {
  const services = [
    {
      id: 'quality',
      title: 'Quality',
      icon: '/images/Icons/Quality.png',
      anchor: '#qualityLoc'
    },
    {
      id: 'lean',
      title: 'Lean',
      icon: '/images/Icons/ProcessImprovement.png',
      anchor: '#leanLoc'
    },
    {
      id: 'industry-tools',
      title: 'Industry Tools',
      icon: '/images/Icons/IndustryTools.png',
      anchor: '#industry_toolsLoc'
    },
    {
      id: 'technology',
      title: 'Technology & Marketing',
      icon: '/images/Icons/Technology (1).png',
      anchor: '#technologyLoc'
    },
    {
      id: 'design',
      title: 'Design & Additive Mfg.',
      icon: '/images/Icons/Design.png',
      anchor: '#designLoc'
    },
    {
      id: 'leadership',
      title: 'Leadership',
      icon: '/images/Icons/Leadership.png',
      anchor: '#leadershipLoc'
    }
  ];

  return (
    <div className="services-page w-full overflow-x-hidden">
      {/* Header Section */}
      <HeadingIntroBanner
        title="Professional Services"
        backgroundImage="/images/factory3.jpg"
      />

      {/* Introduction Section - Red Background */}
      <div style={{backgroundColor: '#9E1B32', width: '100%', padding: '5rem 0'}}>
        <div style={{
          maxWidth: '1232px',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0 2rem',
          margin: '0 auto',
        }}>
          {/* Left Column - Text Content */}
          <div style={{
            flex: '0 0 58.33%',
            minWidth: '300px',
            boxSizing: 'border-box',
            paddingLeft: '0',
            paddingRight: '1.5rem'
          }}>
            <h1 style={{
              fontFamily: 'proxima-nova, sans-serif',
              color: 'white',
              textAlign: 'left',
              fontSize: '2.75rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              PROVIDING THE RIGHT SOLUTIONS FOR YOU
            </h1>
            <hr style={{
              width: '140px',
              margin: '0 0 2rem',
              borderColor: '#E87C90',
            }} />
            <p style={{
              color: 'white',
              fontSize: '1.3rem',
              fontFamily: 'proxima-nova, sans-serif',
              textAlign: 'left',
              lineHeight: '1.4',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Advancing economic development in the state of Alabama since 1986, APC works directly with businesses, organizations, and government agencies throughout Alabama to increase their efficiency, provide cost-saving solutions and improve overall productivity. In 1996, APC also became part of the National Institute of Standards and Technology for the state of Alabama.
            </p>
          </div>

          {/* Right Column - Image */}
          <div style={{
            flex: '0 0 41.67%',
            minWidth: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            paddingRight: '0.5em'
          }}>
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

      {/* Services Grid Section */}
        <section
          style={{
            backgroundColor: '#F2F3F4',
            width: '100%',
            padding: '3rem 1rem 4rem',
          }}
        >
          <div
            style={{
              maxWidth: '1232px',
              margin: '0 auto',
            }}
          >
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

            <div className="services-card-grid">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/Home/ExpandedServices${service.anchor}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="service-card">
                    <Image
                      src={service.icon}
                      alt=""
                      width={90}
                      height={90}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        marginBottom: '1.75rem',
                        transition: 'transform 0.25s ease',
                      }}
                    />

                    <h3
                      style={{
                        color: '#ffffff',
                        fontSize: '1.75rem',
                        fontFamily: 'proxima-nova, sans-serif',
                        fontWeight: 700,
                        margin: 0,
                      }}
                    >
                      {service.title}
                    </h3>

                    <div
                      style={{
                        width: '80px',
                        height: '2px',
                        backgroundColor: '#9E1B32',
                        margin: '1rem auto',
                      }}
                    />

                    <span
                      style={{
                        color: '#E87C90',
                        fontFamily: 'proxima-nova, sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      Learn More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      {/* Internship Hiring Section */}
      <div style={{backgroundColor: '#ffffff', width: '100%', padding: '0'}}>
        <div style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap'
        }}>
          {/* Left Column - Heading and Button */}
          <div style={{
            flex: '0 0 50%',
            minWidth: '300px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2em'
          }}>
            <h2 style={{
              fontFamily: 'proxima-nova, sans-serif',
              color: 'black',
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
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
                color: 'inherit'
              }}
            >
              <button type="submit" className="contact-submit">
                Learn More
              </button>
            </Link>
          </div>

          {/* Right Column - Description */}
          <div style={{
            flex: '0 0 50%',
            minWidth: '300px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2em'
          }}>
            <p style={{
              color: 'black',
              fontSize: '1.3em',
              fontFamily: 'proxima-nova, sans-serif',
              lineHeight: '1.6',
              textAlign: 'center',
              maxWidth: '650px'
            }}>
              The APC works closely with the internship companies with project development when needed. We strive for a Win-Win outcome for the internship program; a benefit to both company and the student.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
        <section className="contact-section">
          <div className="contact-container">
            <h2 className="contact-title">How Can We Help You? We do more, just ask!</h2>
            <div className="contact-title-line" />
            <form className="contact-form">
              <input type="text" id="name" name="name" placeholder="Name" className="contact-input" />
              <div className="contact-row">
                <input type="email" id="email" name="email" placeholder="Email" className="contact-input" />
                <input type="text" id="phone" name="phone" placeholder="Phone" className="contact-input" />
              </div>
              <input type="text" id="company" name="company" placeholder="Company" className="contact-input" />
              <input
                type="text"
                id="services"
                name="services"
                placeholder="Services Requested"
                className="contact-input"
              />
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Message"
                className="contact-input contact-textarea"
              />
              <button type="submit" className="contact-submit">
                Send Message →
              </button>
            </form>
          </div>
        </section>
      </div> 
  );
}

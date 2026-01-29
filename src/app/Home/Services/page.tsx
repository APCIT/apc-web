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
      color: '#022e69',
      anchor: '#qualityLoc'
    },
    {
      id: 'lean',
      title: 'Lean',
      icon: '/images/Icons/ProcessImprovement.png',
      color: '#3d3d3d',
      anchor: '#leanLoc'
    },
    {
      id: 'industry-tools',
      title: 'Industry Tools',
      icon: '/images/Icons/IndustryTools.png',
      color: '#9E1B32',
      anchor: '#industry_toolsLoc'
    },
    {
      id: 'technology',
      title: 'Technology & Marketing',
      icon: '/images/Icons/Technology (1).png',
      color: '#f6c80d',
      anchor: '#technologyLoc'
    },
    {
      id: 'design',
      title: 'Design & Additive Mfg.',
      icon: '/images/Icons/Design.png',
      color: '#9E1B32',
      anchor: '#designLoc'
    },
    {
      id: 'leadership',
      title: 'Leadership',
      icon: '/images/Icons/Leadership.png',
      color: '#022e69',
      anchor: '#leadershipLoc'
    }
  ];

  return (
    <div className="services-page w-full overflow-x-hidden">
      {/* Header Section */}
      <HeadingIntroBanner
        title="Client Services"
        backgroundImage="/images/factory3.jpg"
      />

      {/* Introduction Section - Red Background */}
      <div style={{backgroundColor: '#9E1B32', width: '100%', padding: '3em 0'}}>
        <div style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0 2em'
        }}>
          {/* Left Column - Text Content */}
          <div style={{
            flex: '0 0 58.33%',
            minWidth: '300px',
            boxSizing: 'border-box',
            paddingLeft: '0',
            paddingRight: '1.5em'
          }}>
            <h1 style={{
              fontFamily: 'Roboto, sans-serif',
              color: 'white',
              textAlign: 'center',
              fontSize: '2.5em',
              fontWeight: 'bold',
              marginBottom: '0.5em'
            }}>
              PROVIDING THE RIGHT SOLUTIONS FOR YOU
            </h1>
            <hr style={{
              width: '60%',
              margin: '0 auto 1.5em auto',
              borderColor: 'white',
              borderWidth: '1px 0 0 0'
            }} />
            <p style={{
              color: 'white',
              fontSize: '1.3em',
              fontFamily: 'Roboto, sans-serif',
              textAlign: 'center',
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
                maxWidth: '450px',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
                boxShadow: '0 3px 10px rgba(0,0,0,0.7)'
              }}
            />
          </div>
        </div>
      </div>

      {/* SEE OUR SOLUTIONS BELOW Section */}
      <div style={{backgroundColor: '#ffffff', width: '100%', padding: '2em 0', paddingBottom: 0}}>
        <div style={{padding: '2em 0', paddingBottom: 0, backgroundColor: '#ffffff'}}>
          <h1 style={{
            fontFamily: 'Roboto, sans-serif',
            color: 'black',
            textAlign: 'center',
            fontSize: '2em',
            fontWeight: 'bold'
          }}>
            <strong>SEE OUR SOLUTIONS BELOW:</strong>
        </h1>
          <hr style={{
            width: '30%',
            margin: '0 auto',
            borderColor: 'black',
            borderWidth: '1px 0 0 0'
          }} />
        </div>
      </div>

      {/* Services Grid Section */}
      <div style={{backgroundColor: '#ffffff', width: '100%', padding: '3em 0'}}>
        <div style={{width: '100%', maxWidth: '100%'}}>
          {/* Row 1: Quality, Lean, Industry Tools */}
          <div className="services-grid">
            {services.slice(0, 3).map((service) => (
              <Link
                key={service.id}
                href={`/Home/ExpandedServices${service.anchor}`}
                className="block"
              >
                <div
                  className="text-center p-8 rounded cursor-pointer"
                  style={{
                    backgroundColor: service.color,
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: '0.6s',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '1px 1px 24px 16px rgba(0,0,0,0.61)';
                    e.currentTarget.style.zIndex = '99';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.zIndex = '1';
                  }}
                >
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={120}
                    height={120}
                    className="mb-4"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <h3 style={{
                    color: service.color === '#f6c80d' ? 'black' : 'white',
                    fontSize: 'clamp(1.2em, 3vw, 1.8em)',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    marginTop: '1em'
                  }}>
                    {service.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 2: Technology, Design, Leadership */}
          <div className="services-grid" style={{marginTop: 0}}>
            {services.slice(3, 6).map((service) => (
              <Link
                key={service.id}
                href={`/Home/ExpandedServices${service.anchor}`}
                className="block"
              >
                <div
                  className="text-center p-8 rounded cursor-pointer"
                  style={{
                    backgroundColor: service.color,
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: '0.6s',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '1px 1px 24px 16px rgba(0,0,0,0.61)';
                    e.currentTarget.style.zIndex = '99';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.zIndex = '1';
                  }}
                >
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={120}
                    height={120}
                    className="mb-4"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <h3 style={{
                    color: service.color === '#f6c80d' ? 'black' : 'white',
                    fontSize: 'clamp(1.2em, 3vw, 1.8em)',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    marginTop: '1em'
                  }}>
                    {service.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

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
              fontFamily: 'Roboto, sans-serif',
              color: 'black',
              fontSize: '2em',
              fontWeight: 'bold',
              marginBottom: '0.5em',
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
              <button
                style={{ marginTop: '10px', width: '100%', maxWidth: '450px' }}
                className="
                  bg-[#9E1B32]
                  font-roboto
                  !text-white text-[17px]
                  py-[10px]
                  rounded-full
                  border-[3px] border-[rgba(0,0,0,0.1)]
                  shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                  text-center leading-normal cursor-pointer
                  transition-all duration-500 ease-in-out
                  hover:text-[20px]
                  hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
                  hover:border-[rgba(0,0,0,0.5)]
                "
              >
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
              fontFamily: 'Roboto, sans-serif',
              lineHeight: '1.6',
              textAlign: 'center',
              maxWidth: '650px'
            }}>
              The APC works closely with the internship companies with project development when needed. We strive for a Win-Win outcome for the internship program; a benefit to both company and the student.
            </p>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div style={{backgroundColor: '#ffffff', width: '100%', padding: '0', textAlign: 'center'}}>
        <div>
          <h2 style={{
            fontFamily: 'Roboto, sans-serif',
            color: 'black',
            fontSize: '2.5em',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: '4%',
            margin: 0
          }}>
            <strong>NEED HELP WITH SOMETHING ELSE?</strong>
          </h2>
          <h2 style={{
            fontFamily: 'Roboto, sans-serif',
            color: 'black',
            fontSize: '2.5em',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingBottom: '4%',
            margin: 0
          }}>
            <strong>WE DO MORE, JUST ASK!</strong>
          </h2>
        </div>
      </div>

      {/* Contact Form Section */}
      <div
        className="w-full text-center relative parallax-background"
        style={{
          backgroundColor: '#e5e5e5',
          color: 'white',
          backgroundImage: "url('/images/shattered-dark.png')",
          backgroundSize: '25%',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          paddingTop: '3em',
          paddingBottom: '3em',
          paddingLeft: '1em',
          paddingRight: '1em'
        }}
      >
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '0 15px'
        }}>
          <div style={{
            maxWidth: '75%',
            margin: '0 auto'
          }}>
            <h2 
              className="formtitle"
              style={{
                fontFamily: 'Roboto, sans-serif',
                color: 'white',
                fontSize: '30px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '1em'
              }}
            >
              <strong>HOW CAN WE HELP YOU?</strong>
            </h2>
            <hr style={{
              width: '30%',
              height: '1px',
              backgroundColor: 'white',
              border: 'none',
              margin: '0 auto 2em'
            }} />
            
            <form style={{ maxWidth: '100%' }}>
            {/* Name - Full Width */}
            <div style={{ padding: '2em 0' }}>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Name"
                style={{
                  width: '100%',
                  height: '60px',
                  padding: '0 15px',
                  fontSize: '14px',
                  color: '#555555',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontFamily: 'Roboto, sans-serif'
                }}
              />
            </div>

            {/* Email and Phone - Side by Side */}
            <div style={{ display: 'flex', gap: '4em', width: '100%', padding: '2em 0' }}>
              <div style={{ flex: '0 0 calc(50% - 2em)' }}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  style={{
                    width: '100%',
                    height: '60px',
                    padding: '0 15px',
                    fontSize: '14px',
                    color: '#555555',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                />
              </div>
              <div style={{ flex: '0 0 calc(50% - 2em)' }}>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form-control"
                  placeholder="Phone"
                  style={{
                    width: '100%',
                    height: '60px',
                    padding: '0 15px',
                    fontSize: '14px',
                    color: '#555555',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                />
              </div>
            </div>

            {/* Company - Full Width */}
            <div style={{ padding: '2em 0' }}>
              <input
                type="text"
                id="company"
                name="company"
                className="form-control"
                placeholder="Company"
                style={{
                  width: '100%',
                  height: '60px',
                  padding: '0 15px',
                  fontSize: '14px',
                  color: '#555555',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontFamily: 'Roboto, sans-serif'
                }}
              />
            </div>

            {/* Services Requested - Full Width */}
            <div style={{ padding: '2em 0' }}>
              <input
                type="text"
                id="services"
                name="services"
                className="form-control"
                placeholder="Services Requested"
                style={{
                  width: '100%',
                  height: '60px',
                  padding: '0 15px',
                  fontSize: '14px',
                  color: '#555555',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontFamily: 'Roboto, sans-serif'
                }}
              />
            </div>

            {/* Message - Textarea */}
            <div style={{ padding: '2em 0' }}>
              <textarea
                id="message"
                name="message"
                className="form-control"
                rows={5}
                placeholder="Message"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '14px',
                  color: '#555555',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontFamily: 'Roboto, sans-serif',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                style={{ 
                  width: '100%', 
                  maxWidth: '450px',
                  marginTop: '30px'
                }}
                className="
                  bg-[#9E1B32]
                  font-roboto
                  !text-white text-[17px]
                  py-[10px]
                  rounded-full
                  border-[3px] border-[rgba(0,0,0,0.1)]
                  shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                  text-center leading-normal cursor-pointer
                  transition-all duration-500 ease-in-out
                  hover:text-[20px]
                  hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
                  hover:border-[rgba(0,0,0,0.5)]
                "
              >
                Send Message
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

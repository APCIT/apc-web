'use client';

import React, { useCallback, useMemo, useState } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

type ViewState = 'split' | 'studentExpanded' | 'companyExpanded';

export default function InternshipsPage() {
  const [viewState, setViewState] = useState<ViewState>('split');
  const [showContactForm, setShowContactForm] = useState(false);

  const isSplit = viewState === 'split';
  const isStudentExpanded = viewState === 'studentExpanded';
  const isCompanyExpanded = viewState === 'companyExpanded';

  const spread_right = useCallback(() => {
    setViewState('studentExpanded');
    // Scroll to top on mobile since student will be first
    if (window.innerWidth <= 640) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
      }, 200);
    }
  }, []);

  const spread_left = useCallback(() => {
    setViewState('companyExpanded');
    // Scroll to top on mobile since company will be first
    if (window.innerWidth <= 640) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
      }, 200);
    }
  }, []);

  const studentWidth = useMemo(() => {
    if (isSplit) return '50%';
    if (isStudentExpanded) return '75%';
    return '25%';
  }, [isSplit, isStudentExpanded]);

  const companyWidth = useMemo(() => {
    if (isSplit) return '50%';
    if (isCompanyExpanded) return '75%';
    return '25%';
  }, [isSplit, isCompanyExpanded]);

  return (
    <div className="relative h-screen w-full overflow-x-hidden overflow-y-hidden">
      {/* Mobile Banner - Only visible on mobile */}
      <div className="internships-mobile-banner-wrapper">
        <HeadingIntroBanner
          title="Internships"
          backgroundImage="/images/BlurryIndustry.jpg"
          backgroundPosition="center"
          height="15em"
        />
      </div>
      {/* Student Side */}
      <div
        id="studentSide"
        className="fixed top-0 z-[1] overflow-x-hidden overflow-y-auto transition-[width] duration-[1500ms] ease-in-out"
        style={{ width: studentWidth, left: 0, height: '100vh', backgroundColor: isStudentExpanded ? '#ffffff' : '#920905' }}
      >
        {/* Background image: visible when this side is collapsed */}
        {!isStudentExpanded && (
          <img
            id="studentBackgroundImage"
            src="/images/laptop-stock.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            style={{ objectPosition: 'center' }}
          />
        )}

        {/* Collapsed header (hidden only when student is expanded) */}
        {!isStudentExpanded && (
          <div className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center px-4" style={{ top: '40%', width: '100%' }}>
            <div id="studentHeader" className="flex flex-col items-center text-center gap-8 w-full">
              <h4 className="text-white text-[3.0em] italic font-normal leading-tight mb-2">
                {`I'm a student`}
              </h4>

              <h3
                id="studentDescription"
                className={`text-white font-semibold leading-none tracking-tight mb-8 ${
                  isCompanyExpanded ? 'text-[5.0em]' : 'text-[4.5em]'
                }`}
              >
                {isCompanyExpanded ? (
                  <>
                    <span className="block">LOOKING FOR AN</span>
                    <span className="block">INTERNSHIP</span>
                  </>
                ) : (
                  <>
                    <span className="block">LOOKING FOR</span>
                    <span className="block">AN INTERNSHIP</span>
                  </>
                )}
              </h3>

              <button
                id="studentButton"
                onClick={spread_right}
                style={{ marginTop: '30px', width: '100%', maxWidth: '450px' }}
                className={`
                  bg-white
                  font-roboto
                  !text-[#9E1B32] text-[17px]
                  py-[10px]
                  rounded-full
                  border-[3px] border-[rgba(0,0,0,0.1)]
                  shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                  text-center leading-normal cursor-pointer
                  transition-all duration-500 ease-in-out
                  hover:text-[20px]
                  hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
                  hover:border-[rgba(0,0,0,0.5)]
                `}
              >
                Learn More
              </button>
            </div>
          </div>
        )}

        {/* Expanded content */}
        {isStudentExpanded && (
          <div id="studentInfo" className="relative z-10">
            {/* Top banner replicating the initial hero for Student */}
            <div className="expanded-banner relative text-center md:pt-28 pt-8 w-full md:min-h-[50vh] min-h-[30vh] flex items-center justify-center" style={{ backgroundColor: '#920905' }}>
              <img
                src="/images/laptop-stock.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-20"
                style={{ objectPosition: 'center' }}
              />
              <div className="relative mx-auto px-6">
                <h4 className="text-white text-[3.0em] italic font-normal leading-none m-0">{`I'm a student`}</h4>
                <div className="h-2" />
                <h3 className="text-white text-[4.0em] font-semibold leading-none m-0 tracking-tight">
                  <span className="block whitespace-nowrap">LOOKING FOR</span>
                  <span className="block whitespace-nowrap">AN INTERNSHIP</span>
                </h3>
              </div>
            </div>

            {/* Section: Why Intern + Colleges (two-column, white background) */}
            <div className="w-full bg-white text-black" style={{ color: 'black', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '10px', paddingRight: '10px' }}>
              <div className="mx-auto w-full grid grid-cols-2 gap-12 items-start">
                {/* Left Column */}
                <div className="w-full">
                  <h2 className="text-center" style={{ color: 'black', fontSize: '2em' }}>
                    <strong>WHY SHOULD YOU INTERN?</strong>
                  </h2>
                  <hr style={{ width: '50%', height: '1px', backgroundColor: 'black', border: 'none', margin: '0 auto', marginTop: '1rem', marginBottom: '1rem' }} />
                  <p
                    className="text-center font-normal"
                    style={{ fontSize: '1.75em', paddingLeft: '50px', color: 'black', fontWeight: 'normal' }}
                  >
                    Alabama Productivity Center helps YOU gain knowledge from industry experts. We help YOU network with others. We have improved starting salaries. We help YOU build YOUR resume.
                    We help develop YOUR skills. We make sure YOU secure good recommendations.
                  </p>
                  <hr style={{ width: '50%', height: '1px', backgroundColor: 'black', border: 'none', margin: '0 auto', marginTop: '1rem', marginBottom: '1rem' }} />
                  <div className="text-center mt-4">
                    <button
                      id="applyNow"
                      onClick={() => (window.location.href = '/Apply')}
                      className={`
                        w-[450px]
                        bg-[#9E1B32]
                        font-roboto
                        text-white text-[17px]
                        py-[10px]
                        rounded-full
                        border-[3px] border-[rgba(0,0,0,0.1)]
                        shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                        text-center leading-normal cursor-pointer
                        transition-all duration-500 ease-in-out
                        hover:text-[20px]
                        hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
                        hover:border-[rgba(0,0,0,0.5)]
                      `}
                      style={{ height: 'auto' }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-full">
                  <h2 className="text-center" style={{ color: 'black', fontSize: '2em' }}>
                    <strong>WHAT OTHER COLLEGES DOES APC TEAM WITH?</strong>
                  </h2>
                  <hr style={{ width: '50%', height: '1px', backgroundColor: 'black', border: 'none', margin: '0 auto', marginTop: '1rem', marginBottom: '1rem' }} />
                  <div className="flex justify-center">
                    <img
                      src="/images/Internship_page.jpg"
                      alt="APC Partner Colleges"
                      className="rounded"
                      style={{ width: '90%', maxWidth: '420px', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: 14 Degrees List (Black Background) */}
            <div className="w-full" style={{ backgroundColor: '#000000', color: '#ffffff', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '10px', paddingRight: '10px' }}>
              <div className="mx-auto flex w-full max-w-6xl items-start">
                <div style={{ width: '8.333333%' }} />
                <div style={{ width: '16.666667%', paddingLeft: '4px', paddingRight: '4px' }} className="text-center">
                  <h1 style={{ color: '#ffffff', fontSize: '1.8em', lineHeight: '1.4' }}>
                    We have 14 <br />
                    and <br />
                    counting <br />
                    degrees we <br />
                    work with!
                  </h1>
                </div>
                <div style={{ width: '8.333333%' }} />
                <div style={{ width: '25%', fontSize: '20px', paddingLeft: '4px', paddingRight: '4px' }}>
                  <ul style={{ color: '#ffffff', listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                    <li>Operations Management</li>
                    <li>Mechanical Engineering</li>
                    <li>Management Information Systems</li>
                    <li>Electrical Engineering</li>
                    <li>Finance</li>
                    <li>Business Management</li>
                    <li>Marketing</li>
                  </ul>
                </div>
                <div style={{ width: '25%', fontSize: '20px', paddingLeft: '4px', paddingRight: '4px' }}>
                  <ul style={{ color: '#ffffff', listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                    <li>Industrial & System Engineering</li>
                    <li>Accounting</li>
                    <li>Community College</li>
                    <li>Aerospace Engineering</li>
                    <li>Communication and Info. Science</li>
                    <li>Computer Science</li>
                    <li>Studio Art</li>
                  </ul>
                </div>
                <div style={{ width: '16.666667%' }} />
              </div>
            </div>

            {/* Section: Testimonial (Gray w/ Parallax) */}
            <div
              className="w-full text-center relative"
              style={{
                backgroundColor: 'grey',
                color: 'white',
                backgroundImage: "url('/images/shattered-dark.png')",
                backgroundSize: '25%',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                paddingTop: '20px',
                paddingBottom: '20px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              {/* Quote Icon - Decorative */}
              <div style={{ top: '5%', left: '-10%', position: 'absolute' }}>
                <img src="/images/Icons/quotemarks.png" alt="" style={{ width: '20%' }} />
              </div>

              {/* Heading & HR */}
              <div>
                <h2 style={{ color: 'white', fontSize: '1.3em', fontWeight: 'normal' }}>
                  <strong style={{ fontWeight: 'bold' }}>HEAR FROM PREVIOUS INTERNS:</strong>
                </h2>
                <hr style={{ width: '30%', height: '1px', backgroundColor: 'white', border: 'none', margin: '0 auto', marginTop: '1rem', marginBottom: '1rem' }} />
              </div>

              {/* Quote Text */}
              <div>
                <p style={{ paddingLeft: '150px', paddingRight: '150px', fontSize: '1.5em', color: 'white', lineHeight: '1.3' }}>
                  {`"As a summer intern at Toyota Motor Manufacturing with the Alabama Productivity Center, I was able to gain a better understanding of the career field that I was preparing for. My experience at Toyota also connected me with great people who have played a big role in the start of my career."`}
                  <br />
                  <br />
                  <span style={{ float: 'right' }}> - Hayden D. Bevil, PC, PPM Specialist</span>
                </p>
              </div>
            </div>

            {/* Section: YouTube Video (White Background) */}
            <div className="w-full bg-white px-6 flex justify-center items-center" style={{ paddingTop: '20px', paddingBottom: '120px' }}>
              <iframe
                width="650"
                height="350"
                src="https://www.youtube.com/embed/6cxKX2EI3Ps"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block' }}
                title="Student Internship Testimonial Video"
              />
            </div>
          </div>
        )}
      </div>

      {/* Company Side */}
      <div
        id="companySide"
        className="fixed top-0 z-[1] overflow-x-hidden overflow-y-auto transition-[width] duration-[1500ms] ease-in-out"
        style={{ width: companyWidth, right: 0, height: '100vh', backgroundColor: isCompanyExpanded ? '#ffffff' : 'rgb(75,85,99)' }}
      >
        {/* Background image: visible when this side is collapsed */}
        {!isCompanyExpanded && (
          <img
            id="companyBackgroundImage"
            src="/images/companyBgImage.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            style={{ objectPosition: 'center' }}
          />
        )}

        {/* Collapsed header (hidden only when company is expanded) */}
        {!isCompanyExpanded && (
          <div className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center px-4" style={{ top: '40%', width: '100%' }}>
            <div id="companyHeader" className="flex flex-col items-center text-center gap-8 w-full">
              <h4 className="text-white text-[3.0em] italic font-normal leading-tight mb-2">
                {`I'm a company`}
              </h4>

              <h3
                id="companyDescription"
                className="text-white text-[4.5em] font-semibold leading-none tracking-tight mb-8"
              >
                <span className="block">LOOKING TO</span>
                <span className="block">HIRE AN</span>
                <span className="block">INTERN</span>
              </h3>

              <button
                id="companyButton"
                onClick={spread_left}
                style={{ marginTop: '30px', width: '100%', maxWidth: '450px', color: '#000000' }}
                className={`
                  bg-white
                  font-roboto
                  text-[17px]
                  py-[10px]
                  rounded-full
                  border-[3px] border-[rgba(0,0,0,0.1)]
                  shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                  text-center leading-normal cursor-pointer
                  transition-all duration-500 ease-in-out
                  hover:text-[20px]
                  hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
                  hover:border-[rgba(0,0,0,0.5)]
                `}
              >
                Learn More
              </button>
            </div>
          </div>
        )}

        {/* Expanded content */}
        {isCompanyExpanded && (
          <div id="companyInfo" className="relative z-10">
            {/* Section 1: Hero Banner (Company) */}
            <div className="expanded-banner relative text-center md:pt-28 pt-8 w-full md:min-h-[50vh] min-h-[30vh] flex items-center justify-center" style={{ backgroundColor: 'rgb(75,85,99)' }}>
              <img
                src="/images/companyBgImage.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-20"
                style={{ objectPosition: 'center' }}
              />
              <div className="relative mx-auto px-6">
                <h4 className="text-white text-[3.0em] italic font-normal leading-none m-0">{`I'm a company`}</h4>
                <div className="h-2" />
                <h3 className="text-white text-[4.0em] font-semibold leading-none m-0 tracking-tight">
                  <span className="block">LOOKING TO</span>
                  <span className="block">HIRE AN</span>
                  <span className="block">INTERN</span>
                </h3>
              </div>
            </div>

            {/* Section 2: Why Hire / Photo (White Background) */}
            <div className="w-full bg-white text-black relative z-10" style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '10px', paddingRight: '10px' }}>
              <div className="mx-auto w-full grid grid-cols-2 gap-12 items-center">
                {/* Left Column: Why Hire + Form */}
                <div className="w-full">
                  <h2 className="text-center" style={{ color: 'black', fontSize: '2em' }}>
                    <strong>WHY SHOULD YOU HIRE AN INTERN?</strong>
                  </h2>
                  <hr style={{ width: '50%', height: '1px', backgroundColor: 'black', border: 'none', margin: '0 auto', marginTop: '1rem', marginBottom: '1rem' }} />
                  <p
                    className="text-center font-normal"
                    style={{ fontSize: '1.75em', paddingLeft: '50px', color: 'black', fontWeight: 'normal' }}
                  >
                    YOU would discover new hidden talents, and YOU would reduce employee workload.
                    Interns can increase productivity and retention for YOUR company. As well as YOU can gain new perspectives on organizational issues with interns.
                  </p>
                  <div className="text-center mt-6">
                    <button
                      id="applyNow"
                      onClick={() => setShowContactForm(true)}
                      className={`
                        w-[50%]
                        bg-[#9E1B32]
                        font-roboto
                        text-white text-[1.5em]
                        py-[10px]
                        rounded-full
                        border-[3px] border-[rgba(0,0,0,0.1)]
                        shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                        text-center leading-normal cursor-pointer
                        transition-all duration-500 ease-in-out
                        hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
                        hover:border-[rgba(0,0,0,0.5)]
                      `}
                      style={{ height: 'auto' }}
                    >
                      Sign Up Now
                    </button>
                  </div>

                  {/* Contact Form (initially hidden) */}
                  {showContactForm && (
                    <div id="contactForm" className="mt-8 text-center">
                      <div className="text-black">
                        <p className="mb-4">Contact us using this form!<br /></p>
                        <form className="space-y-4 max-w-md mx-auto">
                          <div>
                            <label className="block text-left mb-1">Name</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              placeholder="Name"
                            />
                          </div>
                          <div>
                            <label className="block text-left mb-1">Email</label>
                            <input
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              placeholder="Email"
                            />
                          </div>
                          <div>
                            <label className="block text-left mb-1">Message</label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              rows={4}
                              placeholder="Message"
                            />
                          </div>
                          <div>
                            <button
                              type="submit"
                              className="bg-[#9E1B32] text-white px-6 py-2 rounded"
                              style={{ marginLeft: '22em' }}
                            >
                              Send
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Photo */}
                <div className="w-full flex justify-center items-center" style={{ minHeight: '100%' }}>
                  <img
                    src="/images/HomepageButtons/JourdanGreen.jpg"
                    alt=""
                    style={{ width: '70%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Testimonial (Gray w/ Parallax) */}
            <div
              className="w-full text-center relative"
              style={{
                backgroundColor: 'grey',
                color: 'white',
                backgroundImage: "url('/images/shattered-dark.png')",
                backgroundSize: '25%',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                paddingTop: '20px',
                paddingBottom: '20px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              {/* Quote Icon - Decorative */}
              <div style={{ top: '5%', left: '-10%', position: 'absolute' }}>
                <img src="/images/Icons/quotemarks.png" alt="" style={{ width: '20%' }} />
              </div>

              {/* Heading & HR */}
              <div>
                <h2 style={{ color: 'white', fontSize: '1.3em' }}>
                  <strong>HEAR FROM PREVIOUS COMPANIES:</strong>
                </h2>
                <hr style={{ width: '30%', height: '1px', backgroundColor: 'white', border: 'none', margin: '0 auto', marginTop: '1rem', marginBottom: '1rem' }} />
              </div>

              {/* Quote Text */}
              <div>
                <p style={{ paddingLeft: '200px', paddingRight: '200px', fontSize: '1.5em', color: 'white' }}>
                  {`"The Alabama Productivity Center Internship Program provided a level of support that would be expected from many professional services. The interns were able to come in, take ownership of Key projects and follow through without holding their hand every step of the way. Their work resulted in significant cost savings and cost avoidance."`}
                  <br />
                  <br />
                  <span style={{ float: 'right' }}> - Gray Shipley and Lloyd Cooper of Movi Medical</span>
                </p>
              </div>
            </div>

            {/* Section 4: YouTube Video (White Background) */}
            <div className="w-full bg-white px-6 flex justify-center items-center" style={{ paddingTop: '20px', paddingBottom: '0px' }}>
              <iframe
                width="650"
                height="350"
                src="https://www.youtube.com/embed/nIVTVwzPuJQ"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block' }}
                title="Company Internship Testimonial Video"
              />
            </div>

            {/* Section 5: Partner Logos Grid */}
            <div className="w-full bg-white px-6" style={{ paddingTop: '0px', paddingBottom: '120px' }}>
              {/* Row 1: 3 columns */}
              <div className="flex justify-center items-center gap-8 mb-8">
                <div className="flex justify-center" style={{ width: '33.33%' }}>
                  <img src="/images/Logos/U-of-Mississippi.png" alt="University of Mississippi" style={{ width: '70%', height: 'auto' }} />
                </div>
                <div className="flex justify-center" style={{ width: '33.33%' }}>
                  <img src="/images/Logos/u-of-a-logo.png" alt="University of Alabama" style={{ width: '70%', height: 'auto' }} />
                </div>
                <div className="flex justify-center" style={{ width: '33.33%' }}>
                  <img src="/images/Logos/uah-logo.svg" alt="UAH" style={{ width: '70%', height: 'auto' }} />
                </div>
              </div>

              {/* Row 2: 4 columns */}
              <div className="flex justify-center items-center gap-6">
                <div className="flex justify-center" style={{ width: '25%' }}>
                  <img src="/images/Logos/Purdue-logo.png" alt="Purdue" style={{ width: '60%', height: 'auto' }} />
                </div>
                <div className="flex justify-center" style={{ width: '25%' }}>
                  <img src="/images/Logos/calhoun-logo.png" alt="Calhoun Community College" style={{ width: '70%', height: 'auto' }} />
                </div>
                <div className="flex justify-center" style={{ width: '25%' }}>
                  <img src="/images/Logos/auburn-logo.png" alt="Auburn University" style={{ width: '70%', height: 'auto' }} />
                </div>
                <div className="flex justify-center" style={{ width: '25%' }}>
                  <img src="/images/Logos/athens-logo.jpeg" alt="Athens State" style={{ width: '40%', height: 'auto' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hide global footer on this page only */}
      <style jsx global>{`
        footer {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

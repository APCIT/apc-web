'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';
import {
  BriefcaseIcon,
  ExpandedHero,
  GrowthIcon,
  HandshakeIcon,
  ApplyHereLink,
  HowItWorksSteps,
  InternshipGuidelines,
  LightbulbIcon,
  MajorsByCategory,
  NetworkIcon,
  PartnerColleges,
  PeopleIcon,
  ReadyCtaBand,
  ResumeIcon,
  StoriesVideoCta,
  TestimonialBand,
  WhyFeatureGrid,
} from './sections';

type ViewState = 'split' | 'studentExpanded' | 'companyExpanded';

const STUDENT_FEATURES = [
  {
    title: 'Real-World Experience',
    description:
      'Apply classroom knowledge to meaningful projects with industry professionals.',
    icon: <BriefcaseIcon />,
  },
  {
    title: 'Resume Development',
    description:
      'Strengthen your resume with valuable experience and marketable skills.',
    icon: <ResumeIcon />,
  },
  {
    title: 'Industry Connections',
    description:
      'Build relationships with professionals and expand your career network.',
    icon: <NetworkIcon />,
  },
  {
    title: 'Career Growth',
    description:
      'Gain skills, confidence, and experience to prepare for your future career.',
    icon: <GrowthIcon />,
  },
];

const COMPANY_FEATURES = [
  {
    title: 'Discover New Talent',
    description: 'Connect with motivated students and identify future employees.',
    icon: <PeopleIcon />,
  },
  {
    title: 'Increase Productivity',
    description:
      'Advance projects and improve operations with support from a dedicated intern and APC staff.',
    icon: <GrowthIcon />,
  },
  {
    title: 'Fresh Perspectives',
    description:
      "Bring new ideas, skills, and innovative solutions to your organization's challenges.",
    icon: <LightbulbIcon />,
  },
  {
    title: 'Build Your Workforce',
    description:
      'Develop a pipeline of emerging professionals with experience in your industry.',
    icon: <HandshakeIcon />,
  },
];

const STUDENT_STEPS = [
  {
    number: '01',
    title: 'Apply',
    description: 'Submit your application and select your preferred internship location.',
    extra: <ApplyHereLink />,
  },
  {
    number: '02',
    title: 'Interview with APC',
    description:
      'APC reviews applications and interviews students to identify potential internship matches.',
  },
  {
    number: '03',
    title: 'Meet with a Company',
    description:
      'Qualified candidates may be invited to interview with a participating company.',
  },
  {
    number: '04',
    title: 'Internship Selection',
    description:
      "If selected, you'll complete the necessary onboarding requirements before beginning your internship.",
  },
  {
    number: '05',
    title: "You're Hired!",
    description:
      'Gain valuable industry experience while working on real projects with support from APC staff.',
    extra: <InternshipGuidelines variant="schedules" />,
  },
];

const COMPANY_STEPS = [
  {
    number: '01',
    title: 'Project Development',
    description:
      'Work with APC to identify opportunities, define project goals, and establish a scope of work.',
  },
  {
    number: '02',
    title: 'Connect With Candidates',
    description:
      'APC recruits and screens qualified students whose skills align with your project needs.',
  },
  {
    number: '03',
    title: 'Interview a Student',
    description:
      'Meet potential candidates and select the student who best fits your organization.',
  },
  {
    number: '04',
    title: 'APC Hires Intern',
    description:
      "APC handles student employment, payroll, workers' compensation, and ongoing support throughout the internship.",
  },
  {
    number: '05',
    title: 'Get Started!',
    description:
      'Your intern begins working on-site with support from APC staff throughout the internship.',
    extra: <InternshipGuidelines variant="guidelines" />,
  },
];

export default function InternshipsClient() {
  const [viewState, setViewState] = useState<ViewState>('split');
  const [showContactForm, setShowContactForm] = useState(false);
  const studentButtonRef = useRef<HTMLButtonElement>(null);
  const companyButtonRef = useRef<HTMLButtonElement>(null);
  const studentPanelRef = useRef<HTMLDivElement>(null);
  const companyPanelRef = useRef<HTMLDivElement>(null);
  const companyFormRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<'student' | 'company' | null>(null);

  const isSplit = viewState === 'split';
  const isStudentExpanded = viewState === 'studentExpanded';
  const isCompanyExpanded = viewState === 'companyExpanded';

  const goToApply = useCallback(() => {
    window.location.href = '/Apply';
  }, []);

  const openCompanyContact = useCallback(() => {
    setShowContactForm(true);
    setTimeout(() => {
      companyFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const spread_right = useCallback(() => {
    setViewState('studentExpanded');
    if (window.innerWidth <= 640) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
      }, 200);
    }
  }, []);

  const spread_left = useCallback(() => {
    setViewState('companyExpanded');
    if (window.innerWidth <= 640) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
      }, 200);
    }
  }, []);

  // Prefetch hero assets so Learn More doesn't hitch on first expand.
  useEffect(() => {
    [
      '/images/Internships/group-photo-2.jpg',
      '/images/Internships/construction-vests.jpg',
      '/images/Internships/group-screenshot.jpg',
      '/images/Internships/zaria-kidd.png',
      '/images/crimson-lowpoly-facets.jpg',
    ].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (viewState === 'studentExpanded') {
      studentPanelRef.current?.scrollTo(0, 0);
      studentPanelRef.current?.focus();
      return;
    }
    if (viewState === 'companyExpanded') {
      companyPanelRef.current?.scrollTo(0, 0);
      companyPanelRef.current?.focus();
      return;
    }
    if (restoreFocusRef.current === 'student') {
      restoreFocusRef.current = null;
      studentButtonRef.current?.focus();
    } else if (restoreFocusRef.current === 'company') {
      restoreFocusRef.current = null;
      companyButtonRef.current?.focus();
    }
  }, [viewState]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || viewState === 'split') return;
      event.preventDefault();
      restoreFocusRef.current = viewState === 'studentExpanded' ? 'student' : 'company';
      setShowContactForm(false);
      setViewState('split');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewState]);

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
    <div className="relative w-full overflow-x-hidden">
      <a href="#studentSide" className="skip-link">
        Skip to student internships
      </a>
      <a href="#companySide" className="skip-link">
        Skip to hiring an intern
      </a>
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
        ref={studentPanelRef}
        className="internships-panel fixed top-0 z-[1] overflow-x-hidden overflow-y-auto"
        style={{
          width: studentWidth,
          left: 0,
          height: '100vh',
          backgroundColor: isStudentExpanded ? '#ffffff' : '#920905',
          color: '#ffffff',
          transition: 'width 900ms cubic-bezier(0.33, 0.05, 0.2, 1)',
          willChange: isSplit ? 'auto' : 'width',
          transform: 'translateZ(0)',
        }}
        role="region"
        aria-label="Student internships"
        tabIndex={-1}
      >
        {!isStudentExpanded && (
          <img
            id="studentBackgroundImage"
            src="/images/laptop-stock.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            style={{ objectPosition: 'center' }}
          />
        )}

        {!isStudentExpanded && (
          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 px-4 text-center"
            style={{ top: '40%', width: '100%' }}
          >
            <div id="studentHeader" className="flex w-full flex-col items-center gap-8 text-center">
              <h4
                className="mb-2 text-[3.0em] font-normal italic leading-tight"
                style={{ color: '#ffffff' }}
              >
                {`I'm a student`}
              </h4>
              <h3
                id="studentDescription"
                className={`mb-8 font-semibold leading-none tracking-tight ${
                  isCompanyExpanded ? 'text-[5.0em]' : 'text-[4.5em]'
                }`}
                style={{ color: '#ffffff' }}
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
                ref={studentButtonRef}
                type="button"
                onClick={spread_right}
                aria-expanded={isStudentExpanded}
                aria-label="Learn more about student internships"
                style={{
                  marginTop: '30px',
                  width: '100%',
                  maxWidth: '450px',
                  backgroundColor: '#ffffff',
                  color: '#9E1B32',
                }}
                className="cursor-pointer rounded-full border-[3px] border-[rgba(0,0,0,0.1)] py-[10px] text-center font-roboto text-[17px] leading-normal shadow-[0_3px_10px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out hover:border-[rgba(0,0,0,0.5)] hover:text-[20px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
              >
                Learn More
              </button>
            </div>
          </div>
        )}

        {isStudentExpanded && (
          <div
            id="studentInfo"
            className="relative z-10"
            style={{ color: '#000000', paddingBottom: '8rem' }}
          >
            <ExpandedHero
              tagline="Your Career Starts Here."
              backgroundImage="/images/Internships/group-photo-2.jpg"
              align="center"
            />

            <WhyFeatureGrid
              heading="Why Intern with APC?"
              features={STUDENT_FEATURES}
              ctaLabel="Apply Now"
              onCtaClick={goToApply}
            />

            <PartnerColleges />

            <MajorsByCategory
              heading="Find an Opportunity that Fits Your Major"
              subheading="Explore internship opportunities across a variety of industries and academic disciplines, connecting your skills with real-world projects."
              footerNote="Don't see your specific major? We are always looking to add more!"
            />

            <HowItWorksSteps
              subheading="APC connects students with meaningful, paid internship opportunities through a simple application and placement process."
              steps={STUDENT_STEPS}
            />

            <TestimonialBand
              variant="student"
              portraitSrc="/images/Internships/zaria-kidd.png"
              portraitAlt="Zaria Kidd"
              quote="The knowledge, skills, and opportunities I received are all imperative and applicable to my future and the career I'm building for myself. I'm very thankful to APC for the opportunity!"
              attribution="Zaria Kidd"
              roleLines={[
                'Former APC Intern',
                'Learning and Development Intern | Mazda Toyota Manufacturing',
              ]}
            />

            <StoriesVideoCta
              heading="Hear From Previous Interns"
              body="Hear from former APC interns about their projects, experiences, and professional growth."
              videoTitle="Student Internship Testimonial Video"
              videoSrc="https://www.youtube.com/embed/6cxKX2EI3Ps?cc_load_policy=1&cc_lang_pref=en"
              ctaLabel="View Intern Success Stories"
              bannerImageSrc="/images/Internships/group-screenshot.jpg"
              bannerObjectPosition="center 40%"
              bannerText="This Could Be You!"
            />

            <ReadyCtaBand
              heading="Ready to Launch Your Career?"
              subtext="Gain hands-on experience, develop valuable skills, and take the next step toward your future."
              ctaLabel="Apply Now"
              onCtaClick={goToApply}
            />
          </div>
        )}
      </div>

      {/* Company Side */}
      <div
        id="companySide"
        ref={companyPanelRef}
        className="internships-panel fixed top-0 z-[1] overflow-x-hidden overflow-y-auto"
        style={{
          width: companyWidth,
          right: 0,
          height: '100vh',
          backgroundColor: isCompanyExpanded ? '#ffffff' : 'rgb(75,85,99)',
          color: '#ffffff',
          transition: 'width 900ms cubic-bezier(0.33, 0.05, 0.2, 1)',
          willChange: isSplit ? 'auto' : 'width',
          transform: 'translateZ(0)',
        }}
        role="region"
        aria-label="Hiring an intern"
        tabIndex={-1}
      >
        {!isCompanyExpanded && (
          <img
            id="companyBackgroundImage"
            src="/images/companyBgImage.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            style={{ objectPosition: 'center' }}
          />
        )}

        {!isCompanyExpanded && (
          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 px-4 text-center"
            style={{ top: '40%', width: '100%' }}
          >
            <div id="companyHeader" className="flex w-full flex-col items-center gap-8 text-center">
              <h4
                className="mb-2 text-[3.0em] font-normal italic leading-tight"
                style={{ color: '#ffffff' }}
              >
                {`I'm a company`}
              </h4>
              <h3
                id="companyDescription"
                className="mb-8 text-[4.5em] font-semibold leading-none tracking-tight"
                style={{ color: '#ffffff' }}
              >
                <span className="block">LOOKING TO</span>
                <span className="block">HIRE AN</span>
                <span className="block">INTERN</span>
              </h3>
              <button
                id="companyButton"
                ref={companyButtonRef}
                type="button"
                onClick={spread_left}
                aria-expanded={isCompanyExpanded}
                aria-label="Learn more about hiring an intern"
                style={{
                  marginTop: '30px',
                  width: '100%',
                  maxWidth: '450px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                }}
                className="cursor-pointer rounded-full border-[3px] border-[rgba(0,0,0,0.1)] py-[10px] text-center font-roboto text-[17px] leading-normal shadow-[0_3px_10px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out hover:border-[rgba(0,0,0,0.5)] hover:text-[20px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
              >
                Learn More
              </button>
            </div>
          </div>
        )}

        {isCompanyExpanded && (
          <div
            id="companyInfo"
            className="relative z-10"
            style={{ color: '#000000', paddingBottom: '8rem' }}
          >
            <ExpandedHero
              tagline="Build Your Future Workforce."
              subtitle="Connect with emerging talent. Solve real challenges. Develop your future workforce."
              backgroundImage="/images/Internships/construction-vests.jpg"
              objectPosition="center 38%"
              align="center"
            />

            <WhyFeatureGrid
              heading="Why Hire an APC Intern?"
              features={COMPANY_FEATURES}
              ctaLabel="Discuss Opportunities"
              onCtaClick={openCompanyContact}
            />

            {showContactForm && (
                  <div
                    ref={companyFormRef}
                    id="contactForm"
                    className="w-full px-4 py-8 text-center sm:px-6"
                    style={{ backgroundColor: '#ffffff', color: '#000000' }}
                  >
                    <p className="mb-4 font-roboto" style={{ color: '#000000' }}>
                      Contact us using this form!
                    </p>
                    <form
                      className="mx-auto max-w-md space-y-4 text-left"
                      aria-label="Company contact form"
                    >
                      <div>
                        <label
                          htmlFor="company-contact-name"
                          className="mb-1 block font-medium"
                          style={{ color: '#35363B' }}
                        >
                          Name
                        </label>
                        <input
                          id="company-contact-name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          className="w-full rounded border border-gray-300 px-3 py-2"
                          style={{ color: '#35363B', backgroundColor: '#ffffff' }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="company-contact-email"
                          className="mb-1 block font-medium"
                          style={{ color: '#35363B' }}
                        >
                          Email
                        </label>
                        <input
                          id="company-contact-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="w-full rounded border border-gray-300 px-3 py-2"
                          style={{ color: '#35363B', backgroundColor: '#ffffff' }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="company-contact-message"
                          className="mb-1 block font-medium"
                          style={{ color: '#35363B' }}
                        >
                          Message
                        </label>
                        <textarea
                          id="company-contact-message"
                          name="message"
                          required
                          className="w-full rounded border border-gray-300 px-3 py-2"
                          style={{ color: '#35363B', backgroundColor: '#ffffff' }}
                          rows={4}
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="rounded px-6 py-2"
                          style={{ backgroundColor: '#9E1B32', color: '#ffffff', border: 'none' }}
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <PartnerColleges
                  heading="Connecting Businesses with Talent Across All Universities"
                  body="The APC partners with colleges and universities to connect businesses with talented students with hands-on industry opportunities."
                  footnote="*Since 2013, the APC has partnered with 20 colleges and universities."
                />

                <MajorsByCategory
                  heading="Find an Intern that Fits Your Project Needs"
                  subheading="From engineering and operations to business and technology, APC connects your company with qualified students whose skills align with your project needs."
                  footerNote="APC helps you identify qualified students whose skills and interests align with your project goals and company culture."
                  footerItalic={false}
                />

                <HowItWorksSteps
                  subheading="From project development to student placement, APC simplifies the internship process so you can focus on results."
                  steps={COMPANY_STEPS}
                />

                <TestimonialBand
                  variant="company"
                  heading="Real Projects. Measurable Results."
                  logoSrc="/images/Logos/stbunn.webp"
                  logoAlt="S.T. Bunn Construction Co., Inc."
                  quote="We believe this program has the potential to save our company money on hauling costs by allowing us to analyze trucking performance in ways that were not previously practical. It should help us compare costs, identify inefficiencies, evaluate truck usage and hauling times, and make better-informed operating decisions."
                  attribution="Taylor Davis,"
                  roleLines={['Vice President,', 'S.T. Bunn Construction Company']}
                />

                <StoriesVideoCta
                  heading="Hear From Our Industry Partners"
                  body="Discover how companies have partnered with APC to complete meaningful projects, improve operations, and develop emerging talent."
                  videoTitle="The Intern Perspective with Thomas Mercier"
                  videoSrc="https://www.youtube.com/embed/nIVTVwzPuJQ?cc_load_policy=1&cc_lang_pref=en"
                  ctaLabel="View Success Stories"
                  backgroundColor="#e8e8e8"
                />

            <ReadyCtaBand
              heading="Ready to Put New Talent to Work?"
              subtext="Discover how an APC intern can support your next project."
              ctaLabel="Request More Information"
              onCtaClick={openCompanyContact}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        footer {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

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
import './sections/internshipsSections.css';

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

const STUDENT_TESTIMONIALS = [
  {
    quote:
      'As a summer intern at Toyota Motor Manufacturing with the Alabama Productivity Center, I was able to gain a better understanding of the career field that I was preparing for. My experience at Toyota also connected me with great people who have played a big role in the start of my career.',
    attribution: 'Hayden D. Bevil',
    roleLines: ['PC, PPM Specialist', 'Toyota Motor Manufacturing'],
  },
  {
    quote:
      'Through the projects I completed at the APC, I was able to learn relevant programming skills that I am still able to apply today at other companies. Working at the APC will teach you more than just how to be a programmer. I believe that the APC offers very rewarding experiences that a lot of students won\'t be able to find anywhere else during the school year.',
    attribution: 'Jared Waller',
    roleLines: ['MIS Intern', 'Alabama Productivity Center'],
  },
  {
    quote:
      'During my internship at Mazda Toyota Manufacturing, I gained valuable hands-on experience in supply chain operations, working with real data to solve real-world problems, and collaborating across multiple teams. The experience strengthened my skills in manufacturing processes, data analytics, and cross-functional communication.',
    attribution: 'Camryn Horrison',
    roleLines: [
      'Logistics and Supply Chain Management Intern',
      'Mazda Toyota Manufacturing',
    ],
  },
  {
    quote:
      'Through my internship at Mercedes-Benz, I hope to gain hands-on experience in process improvement, apply Lean and DMAIC strategies, and work in a fast-paced, quality-focused manufacturing environment.',
    attribution: 'Emily Holcombe',
    roleLines: ['Operations Management Intern', 'Mercedes-Benz'],
  },
  {
    quote:
      "The knowledge, skills, and opportunities I received are all imperative and applicable to my future and the career I'm building for myself. I'm very thankful to APC for the opportunity!",
    attribution: 'Zaria Kidd',
    roleLines: [
      'Former APC Intern',
      'Learning and Development Intern | Mazda Toyota Manufacturing',
    ],
  },
];

const COMPANY_TESTIMONIALS = [
  {
    quote:
      'We believe this program has the potential to save our company money on hauling costs by allowing us to analyze trucking performance in ways that were not previously practical. It should help us compare costs, identify inefficiencies, evaluate truck usage and hauling times, and make better-informed operating decisions.',
    attribution: 'Taylor Davis',
    roleLines: ['Vice President', 'S.T. Bunn Construction Company'],
    logoSrc: '/images/Logos/stbunn.webp',
    logoAlt: 'S.T. Bunn Construction Co., Inc.',
  },
  {
    quote:
      'The University of Alabama ATN Center is a great resource for our business. They are quick to respond and provide the highest level of service. Their internship program has provided great young talent that are able to take on important projects needed to sustain our business. This is a great program for the manufacturing industry in our state.',
    attribution: 'Chase Fell',
    roleLines: ['Vice President of Engineering', 'Precision'],
    logoSrc: '/images/Logos/precision.png',
    logoAlt: 'Precision',
  },
  {
    quote:
      "The project that Olivia accomplished in Animal Health will have a lasting impact on our business. There was so much this summer that we needed help with, to take our business to the next level and I feel like we accomplished it. Without her we would not have been able to make such huge strides.",
    attribution: 'Leigh Oncale',
    roleLines: ['Director, Lean Operations', 'STERIS'],
    logoSrc: '/images/Logos/steris.png',
    logoAlt: 'STERIS',
  },
  {
    quote:
      'Our intern, Marcus Taylor, has been able to make excellent progress…better than we expected on the project to improve the engineering drawing production process. We are near the original schedule despite being able to expand the capabilities of the program significantly.',
    attribution: 'Jeremy Wolfe',
    roleLines: ['Engineering Manager', 'SHECO'],
    logoSrc: '/images/Logos/sheco.png',
    logoAlt: 'SHECO',
  },
  {
    quote:
      'Travis left a vital impact on the Accounting & Finance Department. His analytical skills were critical in creating new processes for improving forecasting metrics on the Treasury side. He also provided vital support in many Treasury activities critical to maintaining proper company standing.',
    attribution: 'Theodore Kubista',
    roleLines: [
      'Financial Reporting, Insurance & Treasury Specialist',
      'Mazda Toyota Manufacturing',
    ],
    logoSrc: '/images/Logos/MTM Logo.jpeg',
    logoAlt: 'Mazda Toyota Manufacturing',
  },
  {
    quote:
      "Anabelle has been a vital member to the team. She has been responsible for the plant's change notification process, making sure that responsible parties acknowledge notification and submit documentation in a timely manner. Anabelle has led the team in AI integration for the automation of processes.",
    attribution: 'Konrad Piepke',
    roleLines: ['Engineering Change Coordinator', 'Lear'],
    logoSrc: '/images/Backgrounds/Lear.jpg',
    logoAlt: 'Lear',
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
  const PANEL_WIDTH_MS = 900;

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
      '/images/crimson-lowpoly-facets.jpg',
      '/images/Logos/stbunn.webp',
      '/images/Logos/precision.png',
      '/images/Logos/steris.png',
      '/images/Logos/sheco.png',
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
    // Collapsing / returning to split — pin both heroes at the top.
    studentPanelRef.current?.scrollTo(0, 0);
    companyPanelRef.current?.scrollTo(0, 0);
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

      {/* Student Side — hero image stays mounted; only overlay copy / body swap */}
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
          transition: `width ${PANEL_WIDTH_MS}ms cubic-bezier(0.33, 0.05, 0.2, 1)`,
          willChange: isSplit ? 'auto' : 'width',
          transform: 'translateZ(0)',
        }}
        role="region"
        aria-label="Student internships"
        tabIndex={-1}
      >
        <ExpandedHero
          backgroundImage="/images/Internships/group-photo-2.jpg"
          align="center"
          fillPanel={!isStudentExpanded}
          tagline="Your Career Starts Here."
          introEyebrow="I'm a student"
          introLines={['LOOKING FOR', 'AN INTERNSHIP']}
          cta={
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
          }
        />

        {isStudentExpanded && (
          <div
            id="studentInfo"
            className="relative z-10"
            style={{ color: '#000000', paddingBottom: '8rem' }}
          >
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
              heading="Hear from Former Interns"
              items={STUDENT_TESTIMONIALS}
            />

            <StoriesVideoCta
              heading="Hear From Previous Interns"
              body="Hear from former APC interns about their projects, experiences, and professional growth."
              videoTitle="Student Internship Testimonial Video"
              videoSrc="https://www.youtube.com/embed/bCsP82ju4fM?cc_load_policy=1&cc_lang_pref=en"
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

      {/* Company Side — same idea: construction-vests hero stays, copy swaps */}
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
          transition: `width ${PANEL_WIDTH_MS}ms cubic-bezier(0.33, 0.05, 0.2, 1)`,
          willChange: isSplit ? 'auto' : 'width',
          transform: 'translateZ(0)',
        }}
        role="region"
        aria-label="Hiring an intern"
        tabIndex={-1}
      >
        <ExpandedHero
          backgroundImage="/images/Internships/construction-vests.jpg"
          objectPosition="center 38%"
          align="center"
          fillPanel={!isCompanyExpanded}
          coverOverlayColor="rgba(75, 85, 99, 0.78)"
          tagline="Build Your Future Workforce."
          subtitle="Connect with emerging talent. Solve real challenges. Develop your future workforce."
          introEyebrow="I'm a company"
          introLines={['LOOKING TO', 'HIRE AN', 'INTERN']}
          cta={
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
          }
        />

        {isCompanyExpanded && (
          <div
            id="companyInfo"
            className="relative z-10"
            style={{ color: '#000000', paddingBottom: '8rem' }}
          >
            <WhyFeatureGrid
              heading="Why Hire an APC Intern?"
              features={COMPANY_FEATURES}
              ctaLabel="Discuss Opportunities"
              onCtaClick={openCompanyContact}
            />

            {showContactForm && (
              <section
                ref={companyFormRef}
                id="contactForm"
                className="contact-section apc-intern-contact"
                aria-label="Company contact"
              >
                <div className="contact-container">
                  <h2 className="contact-title">Contact Us</h2>
                  <div className="contact-title-line" />
                  <form
                    className="contact-form apc-intern-contact-form"
                    aria-label="Company contact form"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <div className="contact-field">
                      <label htmlFor="company-contact-first-name" className="contact-label">
                        First Name
                      </label>
                      <input
                        id="company-contact-first-name"
                        name="firstName"
                        type="text"
                        required
                        aria-required="true"
                        autoComplete="given-name"
                        className="contact-input"
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="company-contact-last-name" className="contact-label">
                        Last Name
                      </label>
                      <input
                        id="company-contact-last-name"
                        name="lastName"
                        type="text"
                        required
                        aria-required="true"
                        autoComplete="family-name"
                        className="contact-input"
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="company-contact-company" className="contact-label">
                        Company Name
                      </label>
                      <input
                        id="company-contact-company"
                        name="company"
                        type="text"
                        required
                        aria-required="true"
                        autoComplete="organization"
                        className="contact-input"
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="company-contact-email" className="contact-label">
                        Email
                      </label>
                      <input
                        id="company-contact-email"
                        name="email"
                        type="email"
                        required
                        aria-required="true"
                        autoComplete="email"
                        className="contact-input"
                      />
                    </div>
                    <div className="apc-intern-contact-submit-wrap">
                      <button type="submit" className="contact-submit">
                        Send →
                      </button>
                    </div>
                  </form>
                </div>
              </section>
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
              items={COMPANY_TESTIMONIALS}
            />

            <StoriesVideoCta
              heading="Hear From Our Industry Partners"
              body="Discover how companies have partnered with APC to complete meaningful projects, improve operations, and develop emerging talent."
              videoTitle="Company Internship Testimonial Video"
              videoSrc="https://www.youtube.com/embed/LZ6OcWki3r0?cc_load_policy=1&cc_lang_pref=en"
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

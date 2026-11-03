'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';
import {
  BriefcaseIcon,
  ExpandedHero,
  GrowthIcon,
  HandshakeIcon,
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
    description:
      'Connect with motivated students and identify potential future employees.',
    icon: <PeopleIcon />,
  },
  {
    title: 'Increase Productivity',
    description:
      'Gain additional support for projects and day-to-day operations.',
    icon: <GrowthIcon />,
  },
  {
    title: 'Fresh Perspectives',
    description:
      'Bring new ideas, creativity, and problem-solving approaches to your organization.',
    icon: <LightbulbIcon />,
  },
  {
    title: 'Build Your Workforce',
    description:
      'Invest in emerging professionals while developing a stronger talent pipeline.',
    icon: <HandshakeIcon />,
  },
];

const STUDENT_STEPS = [
  {
    number: '01',
    title: 'Apply',
    description:
      'Submit your application and resume, including your preferred internship location.',
  },
  {
    number: '02',
    title: 'Interview with The APC',
    description:
      'If your resume matches an available opportunity, you will be invited to interview with an APC staff member.',
  },
  {
    number: '03',
    title: 'Interview with a Company',
    description:
      'If selected to move forward, you will interview with a representative from the partnering company.',
  },
  {
    number: '04',
    title: 'Internship Selection',
    description:
      'Following the interview process, the company will determine whether you are selected for the internship opportunity.',
  },
  {
    number: '05',
    title: "You're Hired!",
    description:
      'Congratulations! Begin gaining valuable industry experience through your APC internship.',
    extra: <InternshipGuidelines />,
  },
];

const COMPANY_STEPS = [
  {
    number: '01',
    title: 'Share Your Needs',
    description:
      'Tell APC about your project needs and requirements and desired qualifications.',
  },
  {
    number: '02',
    title: 'Connect With Candidates',
    description: "Review prospective interns who align with your company's needs.",
  },
  {
    number: '03',
    title: 'Interview a Student',
    description:
      'Meet a student who the APC already interviewed and evaluate their skills.',
  },
  {
    number: '04',
    title: 'Select Your Intern',
    description: 'Choose the candidate who best fits your team and project.',
  },
  {
    number: '05',
    title: 'Get Started!',
    description:
      'Welcome your intern and begin developing the next generation of talent!',
    extra: <InternshipGuidelines />,
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
        className="internships-panel fixed top-0 z-[1] overflow-x-hidden overflow-y-auto transition-[width] duration-[900ms] ease-in-out"
        style={{
          width: studentWidth,
          left: 0,
          height: '100vh',
          backgroundColor: isStudentExpanded ? '#ffffff' : '#920905',
          color: '#ffffff',
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
            <ExpandedHero tagline="Your Career Starts Here." />

            <WhyFeatureGrid
              heading="Why Intern with APC?"
              features={STUDENT_FEATURES}
              ctaLabel="Apply Now"
              onCtaClick={goToApply}
            />

            <PartnerColleges />

            <MajorsByCategory
              heading="Find an Opportunity that Fits Your Major"
              subheading="The APC connects students from a variety of academic backgrounds with valuable industry experience."
              footerNote="Don't see your specific major? We are always looking to add more!"
            />

            <HowItWorksSteps
              subheading="The APC connects students and companies through a structured internship program designed for growth and success."
              steps={STUDENT_STEPS}
            />

            <TestimonialBand
              variant="student"
              quote="As a summer intern at Toyota Motor Manufacturing with the Alabama Productivity Center, I was able to gain a better understanding of the career field that I was preparing for. My experience at Toyota also connected me with great people who have played a big role in the start of my career."
              attribution="Hayden D. Bevil"
              roleLines={['Former APC Intern', 'PC, PPM Specialist']}
            />

            <StoriesVideoCta
              heading="Hear From Previous Interns"
              body="Learn more about the APC internship experience directly from former students."
              videoTitle="Student Internship Testimonial Video"
              showBannerPlaceholder
              bannerText="This Could Be You!"
            />

            <ReadyCtaBand
              subtext="Intern with the APC and invest in your future."
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
        className="internships-panel fixed top-0 z-[1] overflow-x-hidden overflow-y-auto transition-[width] duration-[900ms] ease-in-out"
        style={{
          width: companyWidth,
          right: 0,
          height: '100vh',
          backgroundColor: isCompanyExpanded ? '#ffffff' : 'rgb(75,85,99)',
          color: '#ffffff',
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
            <ExpandedHero tagline="Build Your Future Workforce." />

            <WhyFeatureGrid
              heading="Why Hire an APC Intern?"
              features={COMPANY_FEATURES}
              ctaLabel="Request More Information"
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

            <PartnerColleges />

            <MajorsByCategory
              heading="Find a Major that Fits Your Project"
              subheading="The APC connects students from a variety of academic backgrounds with valuable industry experience."
              footerNote="Don't see the specific major your project needs? The APC is always looking to add more!"
            />

            <HowItWorksSteps
              subheading="The APC handles the coordination and support, making it simple for your company to gain an intern."
              steps={COMPANY_STEPS}
            />

            <TestimonialBand
              variant="company"
              logoPlaceholder="S.T. Bunn Construction"
              quote="We believe this program has the potential to save our company money on hauling costs by allowing us to analyze trucking performance in ways that were not previously practical. It should help us compare costs, identify inefficiencies, evaluate truck usage and hauling times, and make better-informed operating decisions."
              attribution="Taylor Davis, Vice President, S.T. Bunn Construction Company."
            />

            <StoriesVideoCta
              heading="Hear From Previous Company Partnerships"
              body="Learn more about the APC internship experience directly from former students and companies."
              videoTitle="Company Internship Testimonial Video"
            />

            <ReadyCtaBand
              subtext="Partner with APC and invest in the next generation of talent."
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

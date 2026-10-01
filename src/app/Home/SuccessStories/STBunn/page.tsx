import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function STBunnSuccessStoryPage() {
  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="S T Bunn Construction"
        backgroundImage="/images/STBunnHeader.jpg"
        backgroundPosition="center 45%"
        height="21em"
      />

      {/* Background */}
      <section style={whiteSectionStyle}>
        <div style={introGridStyle}>
          <div style={logoWrapStyle}>
            <Image
              src="/images/Logos/stbunn.webp"
              alt="S T Bunn Construction Co., Inc. logo"
              width={480}
              height={280}
              style={logoStyle}
              priority
            />
          </div>

          <div>
            <p style={eyebrowStyle}>Summer 2026 Semester</p>

            <h1 style={sectionHeadingStyle}>
              APC Intern Brings AI Innovation to S T Bunn Construction
            </h1>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Samuel &ldquo;Alex&rdquo; Campbell, a Physics PhD student at The
              University of Alabama, spent his summer internship with S T Bunn
              Construction Company, a highway contractor and asphalt producer,
              through the Alabama Productivity Center.
            </p>
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <div>
            <p style={eyebrowStyle}>Challenge</p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Alex started the internship with no experience building AI agents
              and little knowledge of asphalt operations. Rather than treating
              these two hurdles as obstacles, he approached them as research
              problems, independently studying agent architecture while spending
              time with company employees to understand how jobs, trucks,
              drivers, and existing systems worked together. That groundwork let
              him translate operational pain points into technical requirements
              he could build against.
            </p>
          </div>

          <Image
            src="/images/AlexCampbellHeadshot.jpg"
            alt="Samuel Alex Campbell headshot"
            width={700}
            height={900}
            style={headshotStyle}
          />
        </div>
      </section>

      {/* Solutions */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Solutions</p>

          <p style={bodyStyle}>
            Working closely with the vice president and the operations manager,
            Alex accessed detailed GPS and production data through the
            company&apos;s Fleetwatcher system and used Python to build a custom
            internal AI agent. The tool optimized fleet allocation, flagged
            inefficient trucking behavior, tracked routing and job productivity,
            and gave leadership a clearer, data-driven view of hauling
            operations.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            Alex also built an Excel automation program that streamlined the
            company&apos;s daily trucking report, reducing manual work and
            improving accuracy, a report the company relies on to estimate job
            cost and performance. Through regular check-ins with the vice
            president, Alex refined the tools based on direct feedback, ensuring
            what he built addressed real needs rather than a theoretical fix.
          </p>
        </div>
      </section>

      {/* Impacts */}
      <section style={impactSectionStyle}>
        <div style={impactContainerStyle}>
          <p style={{ ...eyebrowStyle, color: '#FFFFFF' }}>Impacts</p>

          <div style={impactCardStyle}>
            <p style={impactValueStyle}>$500,000</p>
            <p style={impactLabelStyle}>in operational savings</p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section style={lightSectionStyle}>
        <div style={testimonialContainerStyle}>
          <p style={eyebrowStyle}>Quote</p>

          <div style={quoteMarkStyle}>&ldquo;</div>

          <blockquote style={quoteStyle}>
            We believe this program has the potential to save our company money
            on hauling costs by allowing us to analyze trucking performance in
            ways that were not previously practical. It should help us compare
            costs, identify inefficiencies, evaluate truck usage and hauling
            times, and make better-informed operating decisions.
          </blockquote>

          <p style={quoteNameStyle}>Taylor Davis</p>
          <p style={quoteRoleStyle}>
            Vice President, S T Bunn Construction
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={ctaSectionStyle}>
        <h2
          style={{
            ...sectionHeadingStyle,
            marginBottom: '12px',
          }}
        >
          Explore More APC Success Stories
        </h2>

        <p
          style={{
            ...bodyStyle,
            maxWidth: '700px',
            margin: '0 auto 26px',
          }}
        >
          Learn how APC interns apply technical skills to real industry
          challenges and create measurable results for Alabama organizations.
        </p>

        <div style={buttonContainerStyle}>
          <Link href="/Home/SuccessStories" style={primaryButtonStyle}>
            Back to Success Stories
          </Link>

          <Link href="/Home/Internships" style={secondaryButtonStyle}>
            Explore Internships
          </Link>
        </div>
      </section>
    </div>
  );
}

const whiteSectionStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '54px 24px',
};

const lightSectionStyle: CSSProperties = {
  backgroundColor: '#F2F3F4',
  padding: '54px 24px',
};

const textContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
};

const introGridStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1080px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'minmax(220px, 0.75fr) minmax(0, 1.25fr)',
  gap: '42px',
  alignItems: 'center',
};

const logoWrapStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000000',
  borderRadius: '12px',
  padding: '28px 22px',
};

const logoStyle: CSSProperties = {
  width: '100%',
  maxWidth: '320px',
  height: 'auto',
  objectFit: 'contain',
};

const contentGridStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1080px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(260px, 0.8fr)',
  gap: '42px',
  alignItems: 'center',
};

const eyebrowStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.9rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  margin: '0 0 10px',
};

const sectionHeadingStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
  fontWeight: 700,
  lineHeight: 1.15,
  margin: '0 0 20px',
};

const bodyStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.08rem',
  lineHeight: 1.72,
  marginTop: 0,
  marginBottom: '17px',
};

const headshotStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  maxWidth: '360px',
  height: '420px',
  margin: '0 auto',
  objectFit: 'cover',
  objectPosition: 'center top',
  borderRadius: '10px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.10)',
};

const impactSectionStyle: CSSProperties = {
  backgroundColor: '#35363B',
  padding: '54px 24px',
};

const impactContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '760px',
  margin: '0 auto',
  textAlign: 'center',
};

const impactCardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: '34px 24px',
  borderBottom: '6px solid #9E1B32',
};

const impactValueStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: 'clamp(2.4rem, 5vw, 4rem)',
  fontWeight: 700,
  lineHeight: 1,
  margin: '0 0 12px',
};

const impactLabelStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.05rem',
  fontWeight: 600,
  lineHeight: 1.5,
  margin: 0,
};

const testimonialContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '820px',
  margin: '0 auto',
  textAlign: 'center',
};

const quoteMarkStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'Georgia, serif',
  fontSize: '4rem',
  lineHeight: 1,
  marginBottom: '8px',
};

const quoteStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.18rem',
  lineHeight: 1.75,
  fontStyle: 'italic',
  margin: '0 0 24px',
};

const quoteNameStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.1rem',
  fontWeight: 700,
  margin: '0 0 4px',
};

const quoteRoleStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1rem',
  margin: 0,
};

const ctaSectionStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '46px 24px',
  textAlign: 'center',
};

const buttonContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '14px',
};

const primaryButtonStyle: CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#9E1B32',
  color: '#FFFFFF',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1rem',
  fontWeight: 700,
  textDecoration: 'none',
  border: '2px solid #9E1B32',
  borderRadius: '4px',
  padding: '12px 22px',
};

const secondaryButtonStyle: CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#FFFFFF',
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1rem',
  fontWeight: 700,
  textDecoration: 'none',
  border: '2px solid #9E1B32',
  borderRadius: '4px',
  padding: '12px 22px',
};

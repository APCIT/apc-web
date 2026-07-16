import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function SterisSuccessStoryPage() {
  return (
    <main
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Steris"
        backgroundImage="/images/SterisHeader.png"
        backgroundPosition="center 45%"
        height="21em"
      />

      {/* Introduction */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Internship Success Story</p>

          <h1 style={sectionHeadingStyle}>
            Supporting Continuous Improvement Across Multiple Projects
          </h1>

          <p style={bodyStyle}>
            Steris had several projects to complete within its Continuous
            Improvement department. APC intern Olivia Simmons worked alongside
            Steris employees to support projects involving surgical instrument
            identification, surgical gown patterns, and surgical drape tape.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            Each project required research, testing, and analysis to help Steris
            improve product quality, reduce waste, and make informed process
            decisions.
          </p>
        </div>
      </section>

      {/* Project One */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <div>
            <p style={eyebrowStyle}>Project One</p>

            <h2 style={sectionHeadingStyle}>
              Surgical Instrument Identification
            </h2>

            <p style={bodyStyle}>
              Steris needed an easily recognizable identifier for metal
              surgical instruments that could meet several technical and
              regulatory requirements.
            </p>

            <p style={bodyStyle}>
              Olivia led research and experiments involving the liquid
              conversion of ceramic identification inserts used on surgical
              devices.
            </p>

            <p style={bodyStyle}>
              Her analysis considered biocompatibility, adhesion, viscosity,
              melting and boiling points, color options, and the ability to
              withstand autoclave conditions.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              The research and testing results gave Steris useful information
              for evaluating the most appropriate instrument-identification
              method.
            </p>
          </div>

          <Image
            src="/images/Steris1.jpg"
            alt="Surgical instruments with colored identification markings"
            width={900}
            height={600}
            style={sideImageStyle}
          />
        </div>
      </section>

      {/* Project Two */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Project Two</p>

          <h2 style={sectionHeadingStyle}>
            Optimizing Surgical Gown Patterns
          </h2>

          <p style={bodyStyle}>
            Steris also needed updated surgical gown patterns that would match
            incoming outsourced gowns.
          </p>

          <p style={bodyStyle}>
            Olivia used AutoCAD and SolidWorks to create new patterns for all
            four surgical gown sizes.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            The redesigned patterns helped Steris streamline production and
            reduce the amount of material scrap created during each gown cut.
          </p>
        </div>
      </section>

      {/* Project Three */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Project Three</p>

          <h2 style={sectionHeadingStyle}>
            Analyzing Surgical Drape Tape Performance
          </h2>

          <p style={bodyStyle}>
            Steris had received customer complaints involving surgical drape
            tape supplied as part of a purchased product.
          </p>

          <p style={bodyStyle}>
            Olivia reviewed the complaints and studied the variables that could
            affect tape application and performance.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            She conducted several studies and related experiments, including
            comparisons of the pull strength of older tape lots and newer tape
            lots. The findings helped Steris better understand the issue and
            evaluate potential corrective actions.
          </p>
        </div>
      </section>

      {/* Impact */}
      <section style={impactSectionStyle}>
        <div style={impactContainerStyle}>
          <p style={{ ...eyebrowStyle, color: '#FFFFFF' }}>
            Measurable Results
          </p>

          <h2
            style={{
              ...sectionHeadingStyle,
              color: '#FFFFFF',
              marginBottom: '22px',
            }}
          >
            Total Project Impact
          </h2>

          <div style={impactCardStyle}>
            <p style={impactValueStyle}>$2,531,290</p>
            <p style={impactLabelStyle}>
              Estimated financial impact generated through the internship
              projects
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Internship Value</p>

          <h2 style={sectionHeadingStyle}>
            Applying Engineering and Analysis to Real Business Needs
          </h2>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            Olivia&apos;s work supported several areas of Steris&apos;s
            Continuous Improvement department and demonstrated how student
            interns can contribute meaningful research, technical design, and
            product analysis across multiple projects.
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
          Learn how APC interns support Alabama organizations through applied
          research, technical design, and continuous-improvement projects.
        </p>

        <div style={buttonContainerStyle}>
          <Link href="/Home/SuccessStories" style={primaryButtonStyle}>
            Back to Success Stories
          </Link>

          <Link href="/Home/Contact" style={secondaryButtonStyle}>
            Request Services
          </Link>
        </div>
      </section>
    </main>
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

const contentGridStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1080px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)',
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

const sideImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  objectPosition: 'center',
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

const ctaSectionStyle: CSSProperties = {
  backgroundColor: '#F2F3F4',
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
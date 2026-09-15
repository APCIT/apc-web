import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function PrecisionSuccessStoryPage() {
  return (
    <main
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Precision Coil and Rotor"
        backgroundImage="/images/PrecisionHeader.jpg"
        backgroundPosition="center 45%"
        height="21em"
      />

      {/* Situation */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Quality Systems Success Story</p>

          <h1 style={sectionHeadingStyle}>
            Supporting ISO 9001:2015 Compliance and Continuous Improvement
          </h1>

          <p style={bodyStyle}>
            Precision Coil and Rotor manufactures and rebuilds components for
            rotating electrical machines. The company first registered to ISO
            9001:2000 in 2006 and later worked with the University of Alabama
            ATN Center to transition to ISO 9001:2015.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            After acquiring a new customer and adding new processes in 2018,
            Precision Coil and Rotor asked the UA-ATN Center to help prepare for
            its March 2019 ISO 9001:2015 surveillance audit.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>The Solution</p>

          <h2 style={sectionHeadingStyle}>
            Updating Procedures and Preparing for Audit
          </h2>

          <p style={bodyStyle}>
            In January 2019, the UA-ATN team provided technical assistance by
            updating company policies and procedures to align with ISO
            9001:2015 requirements.
          </p>

          <p style={bodyStyle}>
            Once the updates were complete, UA-ATN professional staff and a
            university student intern conducted an internal audit using ISO
            19011 guidelines for auditing management systems.
          </p>

          <p style={bodyStyle}>
            The audit findings led to corrective actions and opportunities for
            improvement. The team supported implementation of those actions and
            also participated in the company&apos;s management review.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            When SAI Global completed the surveillance audit in March 2019,
            Precision Coil and Rotor received an unconditional recommendation
            for continued registration.
          </p>
        </div>
      </section>

      {/* Result */}
      <section style={resultSectionStyle}>
        <div style={resultContainerStyle}>
          <p style={{ ...eyebrowStyle, color: '#FFFFFF' }}>
            Project Result
          </p>

          <h2
            style={{
              ...sectionHeadingStyle,
              color: '#FFFFFF',
              marginBottom: '14px',
            }}
          >
            Unconditional Recommendation for Registration
          </h2>

          <p style={resultTextStyle}>
            UA-ATN continues to serve as Precision Coil and Rotor&apos;s quality
            system advisor, while the company also uses the student internship
            program to support ongoing process improvement.
          </p>
        </div>
      </section>

      {/* Testimonial */}
      <section style={whiteSectionStyle}>
        <div style={testimonialContainerStyle}>
          <p style={eyebrowStyle}>Client Testimonial</p>

          <div style={quoteMarkStyle}>“</div>

          <blockquote style={quoteStyle}>
            The University of Alabama ATN Center is a great resource for our
            business. They are quick to respond and provide the highest level
            of service. Their internship program has provided great young
            talent who are able to take on important projects needed to sustain
            our business. This is a great program for the manufacturing
            industry in our state.
          </blockquote>

          <p style={quoteNameStyle}>Chase Fell</p>
          <p style={quoteRoleStyle}>Vice President of Engineering</p>
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
            maxWidth: '680px',
            margin: '0 auto 26px',
          }}
        >
          Learn how APC and UA-ATN help Alabama manufacturers strengthen
          quality systems and improve operations.
        </p>

        <div style={buttonContainerStyle}>
          <Link href="/Home/SuccessStories" style={primaryButtonStyle}>
            Back to Success Stories
          </Link>

          <Link href="/Home/Services" style={secondaryButtonStyle}>
            Explore Professional Services
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

const resultSectionStyle: CSSProperties = {
  backgroundColor: '#35363B',
  padding: '52px 24px',
};

const resultContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  textAlign: 'center',
};

const resultTextStyle: CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.08rem',
  lineHeight: 1.7,
  margin: 0,
};

const testimonialContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  textAlign: 'center',
};

const quoteMarkStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'Georgia, serif',
  fontSize: '5rem',
  lineHeight: 0.7,
  marginBottom: '18px',
};

const quoteStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
  lineHeight: 1.7,
  fontStyle: 'italic',
  margin: 0,
};

const quoteNameStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.08rem',
  fontWeight: 700,
  margin: '26px 0 3px',
};

const quoteRoleStyle: CSSProperties = {
  color: '#6B7280',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.95rem',
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
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const impacts = [
  {
    value: '$44,053',
    label: 'Estimated Annual Savings',
  },
  {
    value: '2',
    label: 'Defective Engines Per Month',
  },
  {
    value: '1',
    label: 'National Kaizen Nomination',
  },
];

export default function ToyotaSuccessStoryPage() {
  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Toyota"
        backgroundImage="/images/ToyotaHeader.jpg"
        backgroundPosition="center 58%"
        height="21em"
      />

      {/* Introduction */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Internship Success Story</p>

          <h1 style={sectionHeadingStyle}>
            Mistake-Proofing an Engine Assembly Process
          </h1>

          <p style={bodyStyle}>
            Toyota Motor Manufacturing Alabama has provided internships for
            University of Alabama students through the Alabama Productivity
            Center since 2013.
          </p>

          <p style={bodyStyle}>
            Toyota assigns interns special projects that support its annual
            goals and objectives. These internships give students challenging,
            hands-on work that prepares them for their future careers, while APC
            staff provide coaching and support throughout the project period.
          </p>
        </div>
      </section>

      {/* Situation */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <div>
            <p style={eyebrowStyle}>The Situation</p>

            <h2 style={sectionHeadingStyle}>
              Preventing a Hidden Assembly Defect
            </h2>

            <p style={bodyStyle}>
              Hayden Bevil, a University of Alabama senior majoring in
              Operations Management, interned with Toyota Motor Manufacturing
              Alabama during the summer of 2019.
            </p>

            <p style={bodyStyle}>
              Hayden was assigned to work on the TNGA and 2GR assembly lines.
              One of his primary projects was assisting the Kaizen team with
              eliminating defects involving the oil control valve, also known
              as the OCV.
            </p>

            <p style={bodyStyle}>
              Team members installed the OCV on the engine block before adding
              the timing chain cover. Once the cover was installed, the OCV
              could no longer be seen or verified during the final inspection.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              An investigation found that some engines were failing final
              testing because the OCV had never been installed. The issue
              occurred about twice each month and forced Toyota to tear down or
              scrap affected engines.
            </p>
          </div>

          <Image
            src="/images/ToyotaEmblemPic.jpg"
            alt="Toyota emblem on a vehicle steering wheel"
            width={1000}
            height={700}
            style={sideImageStyle}
          />
        </div>
      </section>

      {/* Solution */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>The Solution</p>

          <h2 style={sectionHeadingStyle}>
            Designing a Poka-Yoke Verification Tool
          </h2>

          <p style={bodyStyle}>
            Hayden worked with a Toyota team member to design a poka-yoke
            device that would prevent the installation mistake. Poka-yoke is a
            Japanese term meaning mistake-proofing.
          </p>

          <p style={bodyStyle}>
            The solution consisted of a handheld jig suspended above the
            assembly line. A proximity sensor inside the jig displayed a green
            light when it made contact with a metal surface.
          </p>

          <p style={bodyStyle}>
            The team member could place the jig over the OCV location on the
            engine block. When the OCV was properly installed, the sensor
            detected it, displayed a green light, and allowed the engine to
            continue down the line.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            When the OCV was missing, the assembly line stopped immediately.
            This allowed the issue to be corrected at the point where it
            occurred instead of being discovered during final testing, when the
            engine would be much more difficult and expensive to repair.
          </p>
        </div>
      </section>

      {/* Results */}
      <section style={impactSectionStyle}>
        <div style={wideContainerStyle}>
          <div style={impactHeadingStyle}>
            <p style={{ ...eyebrowStyle, color: '#FFFFFF' }}>
              Measurable Results
            </p>

            <h2
              style={{
                ...sectionHeadingStyle,
                color: '#FFFFFF',
                marginBottom: '12px',
              }}
            >
              Project Impact
            </h2>

            <p style={impactIntroStyle}>
              The mistake-proofing device helped Toyota catch missing OCVs
              before engines reached the final testing stage.
            </p>
          </div>

          <div style={impactGridStyle}>
            {impacts.map((impact) => (
              <div key={impact.label} style={impactCardStyle}>
                <p style={impactValueStyle}>{impact.value}</p>
                <p style={impactLabelStyle}>{impact.label}</p>
              </div>
            ))}
          </div>

          <div style={recognitionBoxStyle}>
            <h3 style={recognitionHeadingStyle}>
              Recognized Beyond the Internship
            </h3>

            <p style={recognitionTextStyle}>
              The kaizen saved Toyota an estimated $44,053 each year in engine
              teardown and scrapping costs. A few months after Hayden’s
              internship, the project was nominated for Best Quality Kaizen and
              competed for a national award in Texas.
            </p>

            <p style={{ ...recognitionTextStyle, marginBottom: 0 }}>
              Other Toyota engine plants also began implementing the poka-yoke
              solution.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={lightSectionStyle}>
        <div style={testimonialContainerStyle}>
          <p style={eyebrowStyle}>Intern Testimonial</p>

          <div style={quoteMarkStyle}>“</div>

          <blockquote style={quoteStyle}>
            As a summer intern at Toyota Motor Manufacturing Alabama with the
            Alabama Productivity Center, I was able to gain a better
            understanding of the career field that I was preparing for. I
            learned valuable lessons that can only be obtained through working
            in the field.
            <br />
            <br />
            My experience at Toyota also connected me with great people who
            have played a big role in the start of my career. Many students do
            not get an opportunity like this, and I will always be grateful for
            my experience there. Because of this internship, I am now working
            with Mazda Toyota Manufacturing U.S.A.
          </blockquote>

          <p style={quoteNameStyle}>Hayden D. Bevil</p>
          <p style={quoteRoleStyle}>PC, PPM Specialist</p>
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
          Learn how APC internships give students meaningful industry
          experience while helping Alabama manufacturers solve practical
          problems.
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
  padding: '56px 24px',
};

const lightSectionStyle: CSSProperties = {
  backgroundColor: '#F2F3F4',
  padding: '56px 24px',
};

const textContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
};

const wideContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1120px',
  margin: '0 auto',
};

const contentGridStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1120px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(320px, 0.85fr)',
  gap: '46px',
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
  height: '360px',
  objectFit: 'cover',
  objectPosition: 'center',
  borderRadius: '10px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.10)',
};

const impactSectionStyle: CSSProperties = {
  backgroundColor: '#35363B',
  padding: '56px 24px',
};

const impactHeadingStyle: CSSProperties = {
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto 30px',
};

const impactIntroStyle: CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.05rem',
  lineHeight: 1.65,
  margin: 0,
};

const impactGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '18px',
};

const impactCardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '10px',
  padding: '28px 18px',
  textAlign: 'center',
  borderBottom: '5px solid #9E1B32',
};

const impactValueStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: 'clamp(1.8rem, 3vw, 2.75rem)',
  fontWeight: 700,
  lineHeight: 1,
  margin: '0 0 10px',
};

const impactLabelStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.98rem',
  fontWeight: 600,
  margin: 0,
};

const recognitionBoxStyle: CSSProperties = {
  maxWidth: '850px',
  margin: '28px auto 0',
  padding: '24px 28px',
  border: '1px solid rgba(255, 255, 255, 0.35)',
  borderRadius: '10px',
};

const recognitionHeadingStyle: CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.35rem',
  fontWeight: 700,
  margin: '0 0 10px',
};

const recognitionTextStyle: CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1rem',
  lineHeight: 1.65,
  margin: '0 0 12px',
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
  fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
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
  backgroundColor: '#FFFFFF',
  padding: '48px 24px',
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
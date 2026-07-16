import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const impacts = [
  {
    value: '$2,877,200',
    label: 'Retained Sales',
  },
  {
    value: '$146,096',
    label: 'Cost Savings',
  },
  {
    value: '$17,750',
    label: 'New Investments',
  },
  {
    value: '$3,041,046',
    label: 'Total Impact',
  },
];

const accomplishments = [
  'Completed a 5S event that reorganized the unit warehouse, improved material storage, and reclaimed scrap equipment and materials.',
  'Improved batch-cleanup standards to reduce the risk of contamination in future products.',
  'Created a listing and map of emergency notification pushbutton stations to support faster emergency response.',
  'Developed laboratory and operating procedures for a new product launch, including PPE requirements and employee training.',
  'Improved product-emission calculations submitted to the Environmental Protection Agency.',
  'Resolved customer complaints involving product packaging.',
  'Completed DOT placarding and labeling compliance checks and updated related procedures.',
  'Checked and updated P&IDs, process-flow diagrams, and risk-based inspection documents for process-safety compliance.',
];

export default function EvonikSuccessStoryPage() {
  return (
    <main
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Evonik Industries"
        backgroundImage="/images/EvonikHeader.jpg"
        backgroundPosition="center 60%"
        height="21em"
      />

      {/* Introduction */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Engineering Internship Success Story</p>

          <h1 style={sectionHeadingStyle}>
            Supporting Safety, Compliance, and Continuous Improvement
          </h1>

          <p style={bodyStyle}>
            Evonik&apos;s Mobile-area facility is the company&apos;s largest
            North American site. Approximately 700 employees produce hydrogen
            peroxide, fumed silica, methionine, and other specialty chemicals.
          </p>

          <p style={bodyStyle}>
            Evonik&apos;s MMAT business unit in Theodore, Alabama, requested
            assistance with 5S projects, a new product launch, packaging
            complaints, process-safety work, and Department of Transportation
            requirements.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            During the summer of 2016, the Alabama Productivity Center assigned
            a University of Alabama Chemical and Biological Engineering intern,
            supported by APC professional staff, to assist with this work.
          </p>
        </div>
      </section>

      {/* Objective */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <div>
            <p style={eyebrowStyle}>The Objective</p>

            <h2 style={sectionHeadingStyle}>
              Helping the MMAT Unit Meet Operational and Regulatory Goals
            </h2>

            <p style={bodyStyle}>
              The engagement focused on continuing Evonik&apos;s 5S program
              while also completing projects related to safety, environmental
              performance, OSHA process-safety management, and DOT compliance.
            </p>

            <p style={bodyStyle}>
              The intern supported projects across warehouse organization,
              emergency response, product testing, operating procedures,
              emissions calculations, packaging, labeling, and engineering
              documentation.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              This broad project scope gave the intern practical experience
              across both chemical engineering and manufacturing operations.
            </p>
          </div>

          <Image
            src="/images/MobilePic.jpg"
            alt="Downtown Mobile, Alabama skyline"
            width={800}
            height={800}
            style={sideImageStyle}
          />
        </div>
      </section>

      {/* Accomplishments */}
      <section style={whiteSectionStyle}>
        <div style={wideContainerStyle}>
          <div style={sectionIntroStyle}>
            <p style={eyebrowStyle}>Project Accomplishments</p>

            <h2 style={sectionHeadingStyle}>
              Improving Processes Across the Business Unit
            </h2>
          </div>

          <div style={accomplishmentGridStyle}>
            {accomplishments.map((accomplishment, index) => (
              <article key={accomplishment} style={accomplishmentCardStyle}>
                <p style={numberStyle}>
                  {String(index + 1).padStart(2, '0')}
                </p>

                <p style={accomplishmentTextStyle}>{accomplishment}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* New product and documentation */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <Image
            src="/images/BrainstormPic.jpg"
            alt="Notes used for planning and process improvement"
            width={1000}
            height={700}
            style={sideImageStyle}
          />

          <div>
            <p style={eyebrowStyle}>Applied Engineering Work</p>

            <h2 style={sectionHeadingStyle}>
              Supporting a New Product Launch
            </h2>

            <p style={bodyStyle}>
              The intern helped Evonik prepare for a new product start-up by
              writing laboratory procedures to test product characteristics and
              creating operating procedures for production.
            </p>

            <p style={bodyStyle}>
              The procedures included guidance for properly handling the new
              product, selecting required personal protective equipment, and
              training employees on the updated process.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              The intern also improved emissions calculations, updated process
              documentation, and reviewed P&IDs and process-flow diagrams to
              support regulatory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Impact */}
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
                marginBottom: 0,
              }}
            >
              Project Impact
            </h2>
          </div>

          <div style={impactGridStyle}>
            {impacts.map((impact) => (
              <div key={impact.label} style={impactCardStyle}>
                <p style={impactValueStyle}>{impact.value}</p>
                <p style={impactLabelStyle}>{impact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={whiteSectionStyle}>
        <div style={testimonialContainerStyle}>
          <p style={eyebrowStyle}>Client Testimonial</p>

          <div style={quoteMarkStyle}>“</div>

          <blockquote style={quoteStyle}>
            The Alabama Productivity Center intern routinely took initiative
            and found work by listening in meetings and asking questions. She
            demonstrated a sound technical background by accurately performing
            engineering calculations to estimate the time it would take to
            perform a liquid-liquid azeotropic distillation.
          </blockquote>

          <p style={quoteNameStyle}>Randy Rogers</p>
          <p style={quoteRoleStyle}>
            Director, Site Communications and Government Affairs
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
          Learn how APC interns help Alabama organizations improve operations,
          safety, regulatory compliance, and technical processes.
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
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '44px',
  alignItems: 'center',
};

const sectionIntroStyle: CSSProperties = {
  maxWidth: '850px',
  marginBottom: '28px',
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
  height: '330px',
  objectFit: 'cover',
  objectPosition: 'center',
  borderRadius: '10px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.10)',
};

const accomplishmentGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '18px',
};

const accomplishmentCardStyle: CSSProperties = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start',
  backgroundColor: '#F2F3F4',
  borderLeft: '5px solid #9E1B32',
  borderRadius: '8px',
  padding: '20px',
};

const numberStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.15rem',
  fontWeight: 700,
  margin: 0,
  flexShrink: 0,
};

const accomplishmentTextStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.98rem',
  lineHeight: 1.6,
  margin: 0,
};

const impactSectionStyle: CSSProperties = {
  backgroundColor: '#35363B',
  padding: '54px 24px',
};

const impactHeadingStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '30px',
};

const impactGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
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
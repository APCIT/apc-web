import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const impacts = [
  {
    value: '$6,500',
    label: 'Increased Sales',
  },
  {
    value: '$54,850',
    label: 'Cost Savings',
  },
  {
    value: '$2,000',
    label: 'Investment Savings',
  },
  {
    value: '$63,350',
    label: 'Total Impact',
  },
];

export default function ShecoSuccessStoryPage() {
  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Southern Heat Exchanger"
        backgroundImage="/images/SHECOHeader.jpg"
        backgroundPosition="center 60%"
        height="21em"
      />

      {/* Introduction */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Engineering Internship Success Story</p>

          <h1 style={sectionHeadingStyle}>
            Improving Engineering Drawings Through Software Integration
          </h1>

          <p style={bodyStyle}>
            Southern Heat Exchanger Corporation partnered with the Alabama
            Productivity Center to improve its engineering drawing production
            process.
          </p>

          <p style={bodyStyle}>
            The project focused on implementing Compress and Autodesk Inventor
            to reduce repeated data entry, limit errors caused by disconnected
            calculations, drawings, and bills of material, and improve the
            on-time delivery of engineering drawings.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            APC assigned Marcus Taylor, a University of Alabama mechanical
            engineering student with a minor in computer science and experience
            using Inventor, to support the project.
          </p>
        </div>
      </section>

      {/* Objective */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>The Objective</p>

          <h2 style={sectionHeadingStyle}>
            Connecting Calculations, Drawings, and Manufacturing Data
          </h2>

          <p style={bodyStyle}>
            SHECO&apos;s previous drawing-production system had been created
            more than 20 years earlier and offered limited opportunities for
            automation or continuous improvement.
          </p>

          <p style={bodyStyle}>
            Marcus worked to create a more connected process in which
            calculations, engineering drawings, and eventually bills of
            material could share data.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            By reducing the number of times information had to be entered
            manually, the new system was designed to save engineering time and
            decrease the risk of inconsistent or incorrect information.
          </p>
        </div>
      </section>

      {/* Accomplishments */}
      <section style={whiteSectionStyle}>
        <div style={wideContainerStyle}>
          <div style={sectionIntroStyle}>
            <p style={eyebrowStyle}>Project Accomplishments</p>

            <h2 style={sectionHeadingStyle}>
              Building a More Efficient Drawing Process
            </h2>
          </div>

          <div style={accomplishmentGridStyle}>
            <article style={accomplishmentCardStyle}>
              <h3 style={cardHeadingStyle}>Reduced Data Re-entry</h3>

              <p style={cardTextStyle}>
                Linking calculations, drawings, and bills of material was
                projected to reduce repeated data entry and lower the
                possibility of engineering errors.
              </p>
            </article>

            <article style={accomplishmentCardStyle}>
              <h3 style={cardHeadingStyle}>Automated Drawing Tasks</h3>

              <p style={cardTextStyle}>
                Automating routine drawing tasks reduced the amount of time the
                engineering department needed to spend creating each drawing.
              </p>
            </article>

            <article style={accomplishmentCardStyle}>
              <h3 style={cardHeadingStyle}>Continuous Improvement</h3>

              <p style={cardTextStyle}>
                The updated system gave SHECO the ability to continue refining
                its drawing-creation process instead of remaining limited by
                the older legacy system.
              </p>
            </article>

            <article style={accomplishmentCardStyle}>
              <h3 style={cardHeadingStyle}>CNC Manufacturing Support</h3>

              <p style={cardTextStyle}>
                The resulting models could be used by computer-aided
                manufacturing software to generate machine code for equipment
                such as plasma tables, laser tables, vertical turning lathes,
                and drill tables.
              </p>
            </article>
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
      <section style={lightSectionStyle}>
        <div style={testimonialContainerStyle}>
          <p style={eyebrowStyle}>Client Testimonial</p>

          <div style={quoteMarkStyle}>“</div>

          <blockquote style={quoteStyle}>
            Our intern, Marcus Taylor, has been able to make excellent
            progress—better than we expected—on the project to improve the
            engineering drawing production process. We are near the original
            schedule despite being able to expand the capabilities of the
            program significantly.
          </blockquote>

          <p style={quoteNameStyle}>Jeremy Wolfe</p>
          <p style={quoteRoleStyle}>Engineering Manager</p>
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
          Learn how APC interns help Alabama organizations improve engineering,
          software, and manufacturing processes.
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

const wideContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1120px',
  margin: '0 auto',
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

const accomplishmentGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '20px',
};

const accomplishmentCardStyle: CSSProperties = {
  backgroundColor: '#F2F3F4',
  borderTop: '5px solid #9E1B32',
  borderRadius: '10px',
  padding: '24px',
};

const cardHeadingStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.2rem',
  fontWeight: 700,
  margin: '0 0 10px',
};

const cardTextStyle: CSSProperties = {
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
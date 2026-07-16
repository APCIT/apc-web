import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const impacts = [
  {
    value: '$80,000',
    label: 'Estimated Cost Savings',
  },
  {
    value: '$1',
    label: 'Approximate Cost Per Printed Part',
  },
  {
    value: '$30–$40',
    label: 'Typical Purchased Part Cost',
  },
];

export default function AustalSuccessStoryPage() {
  return (
    <main
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Austal USA"
        backgroundImage="/images/AustalHeader.png"
        backgroundPosition="center 45%"
        height="21em"
      />

      {/* Introduction */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Internship Success Story</p>

          <h1 style={sectionHeadingStyle}>
            Creating Long-Term Savings Through Additive Manufacturing
          </h1>

          <p style={bodyStyle}>
            Austal is one of the largest shipbuilding companies in the world,
            producing passenger ferries, patrol boats, high-speed support
            vessels, surface combatants, and multi-role vessels.
          </p>

          <p style={bodyStyle}>
            Austal USA opened its Mobile, Alabama shipyard in 1999 and has grown
            into one of the area’s largest employers, with approximately 4,000
            employees. The Mobile facility supports major U.S. Navy shipbuilding
            programs, including the Littoral Combat Ship and Expeditionary Fast
            Transport programs.
          </p>
        </div>
      </section>

      {/* Intern overview */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <div>
            <p style={eyebrowStyle}>Summer 2019 Internship</p>

            <h2 style={sectionHeadingStyle}>
              Applying Mechanical Engineering in a Shipyard Environment
            </h2>

            <p style={bodyStyle}>
              During the summer of 2019, the Alabama Productivity Center placed
              Thomas Mercier with Austal USA.
            </p>

            <p style={bodyStyle}>
              Thomas was a senior mechanical engineering student at The
              University of Alabama and had recently completed a co-op with
              Johnson Controls in Geneva, Alabama.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              During his internship, Thomas worked on two primary projects:
              evaluating vendor products for Austal employees and developing
              replacement parts through additive manufacturing.
            </p>
          </div>

          <Image
            src="/images/Austal1.jpg"
            alt="Austal vessel at the Port of Mobile"
            width={1000}
            height={650}
            style={sideImageStyle}
          />
        </div>
      </section>

      {/* Vendor project */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Project One</p>

          <h2 style={sectionHeadingStyle}>
            Evaluating Products and Supporting Purchasing Decisions
          </h2>

          <p style={bodyStyle}>
            Thomas met with sales representatives, listened to product
            presentations, and evaluated the options being proposed to Austal.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            He then created reports for Austal employees that summarized the
            products and helped decision-makers compare which options best met
            the company’s needs.
          </p>
        </div>
      </section>

      {/* Additive manufacturing */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <Image
            src="/images/Austal2.jpg"
            alt="Additive manufacturing equipment producing a 3D-printed part"
            width={800}
            height={800}
            style={sideImageStyle}
          />

          <div>
            <p style={eyebrowStyle}>Project Two</p>

            <h2 style={sectionHeadingStyle}>
              Replacing Purchased Parts With 3D-Printed Designs
            </h2>

            <p style={bodyStyle}>
              Thomas also worked on an additive manufacturing project.
              Additive manufacturing creates three-dimensional objects by
              building material layer by layer.
            </p>

            <p style={bodyStyle}>
              He met with skilled workers to identify small parts and
              components they regularly needed to order. Instead of purchasing
              a replacement part for approximately $30 to $40, Thomas modeled
              the part in CAD software and produced it with a 3D printer for
              roughly $1.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Once a design was completed, Austal could save the CAD file and
              print the same part again whenever it was needed, eliminating
              repeated purchasing costs and reducing wait time.
            </p>
          </div>
        </div>
      </section>

      {/* Process explanation */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>The Process</p>

          <h2 style={sectionHeadingStyle}>
            Turning a One-Time Design Into Ongoing Savings
          </h2>

          <div style={processGridStyle}>
            <div style={processCardStyle}>
              <p style={stepNumberStyle}>1</p>
              <h3 style={processHeadingStyle}>Identify the Part</h3>
              <p style={processTextStyle}>
                Skilled workers identified frequently ordered parts that could
                potentially be produced internally.
              </p>
            </div>

            <div style={processCardStyle}>
              <p style={stepNumberStyle}>2</p>
              <h3 style={processHeadingStyle}>Model the Design</h3>
              <p style={processTextStyle}>
                Thomas measured the part and recreated it using CAD software.
              </p>
            </div>

            <div style={processCardStyle}>
              <p style={stepNumberStyle}>3</p>
              <h3 style={processHeadingStyle}>Print and Reuse</h3>
              <p style={processTextStyle}>
                Austal printed the part at a fraction of the purchase price and
                retained the digital design for future use.
              </p>
            </div>
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
                marginBottom: '12px',
              }}
            >
              Additive Manufacturing Impact
            </h2>

            <p style={impactIntroStyle}>
              Thomas generated approximately $80,000 in cost-saving
              improvements during the internship, and those savings can
              continue growing as Austal reuses the completed designs.
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
        </div>
      </section>

      {/* Conclusion */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Long-Term Value</p>

          <h2 style={sectionHeadingStyle}>
            A Project That Continues to Deliver Results
          </h2>

          <p style={bodyStyle}>
            The value of Thomas’s work extended beyond the summer internship.
            By creating reusable CAD designs, Austal gained a library of parts
            that could be produced internally whenever needed.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            Each future print provides additional savings while also reducing
            dependence on outside orders and shortening the time required to
            replace commonly used parts.
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
          Discover how APC interns apply technical skills to real industry
          challenges and create measurable results for Alabama organizations.
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
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
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
  height: '340px',
  objectFit: 'cover',
  objectPosition: 'center',
  borderRadius: '10px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.10)',
};

const processGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '20px',
  marginTop: '28px',
};

const processCardStyle: CSSProperties = {
  backgroundColor: '#F2F3F4',
  borderTop: '5px solid #9E1B32',
  borderRadius: '10px',
  padding: '24px',
};

const stepNumberStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '2rem',
  fontWeight: 700,
  lineHeight: 1,
  margin: '0 0 12px',
};

const processHeadingStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.2rem',
  fontWeight: 700,
  margin: '0 0 10px',
};

const processTextStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.98rem',
  lineHeight: 1.6,
  margin: 0,
};

const impactSectionStyle: CSSProperties = {
  backgroundColor: '#35363B',
  padding: '56px 24px',
};

const impactHeadingStyle: CSSProperties = {
  textAlign: 'center',
  maxWidth: '820px',
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
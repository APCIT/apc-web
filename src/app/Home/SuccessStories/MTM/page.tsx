import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function MTMSuccessStoryPage() {
  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Mazda Toyota Manufacturing"
        backgroundImage="/images/MTMHeader.jpeg"
        backgroundPosition="center 48%"
        height="21em"
      />

      {/* Introduction */}
      <section style={whiteSectionStyle}>
        <div style={introGridStyle}>
          <div>
            <p style={eyebrowStyle}>Success Story Spotlight</p>

            <h1 style={sectionHeadingStyle}>
              Improving Treasury Forecasting Through Data Analysis
            </h1>

            <p style={bodyStyle}>
              During his internship at Mazda Toyota Manufacturing, Travis
              McGuire helped improve the company&apos;s monthly interest income
              forecasting process.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              By reviewing more than a year of financial data and comparing
              forecasted results with actual performance, Travis identified
              opportunities to improve forecasting accuracy and reduce major
              variances.
            </p>
          </div>

          <aside style={profileCardStyle}>
            <h2 style={profileHeadingStyle}>Internship Profile</h2>

            <DetailRow label="Student" value="Travis McGuire" />
            <DetailRow label="Degree" value="B.S. Accounting" />
            <DetailRow
              label="University"
              value="The University of Alabama"
            />
            <DetailRow
              label="Internship Company"
              value="Mazda Toyota Manufacturing"
              isLast
            />
          </aside>
        </div>
      </section>

      {/* Project */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Driving Impact Through Treasury Forecasting</p>

          <h2 style={sectionHeadingStyle}>
            Building a More Accurate Forecasting Process
          </h2>

          <p style={bodyStyle}>
            Travis conducted a detailed review of historical interest income
            data and analyzed the differences between forecasted and actual
            results.
          </p>

          <p style={bodyStyle}>
            He introduced new forecasting formulas, established consistent
            communication with JPMorgan to receive timely rate updates, and
            created a more structured forecasting system.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            Travis also used Excel and Power BI to organize the information,
            visualize performance, and demonstrate measurable improvement in
            the forecasting process.
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
              marginBottom: '24px',
            }}
          >
            Forecasting Accuracy Improved
          </h2>

          <div style={impactCardStyle}>
            <p style={impactValueStyle}>66%</p>

            <p style={impactLabelStyle}>
              Improvement in interest income forecasting accuracy
            </p>
          </div>
        </div>
      </section>

      {/* Mentor quote */}
      <section style={whiteSectionStyle}>
        <div style={testimonialContainerStyle}>
          <p style={eyebrowStyle}>Mentor Perspective</p>

          <div style={quoteMarkStyle}>“</div>

          <blockquote style={quoteStyle}>
            Travis left a vital impact on the Accounting &amp; Finance
            Department. His analytical skills were critical in creating new
            processes for improving forecasting metrics on the Treasury side.
            He also provided vital support in many Treasury activities
            critical to maintaining proper company standing.
          </blockquote>

          <p style={quoteNameStyle}>Theodore Kubista</p>

          <p style={quoteRoleStyle}>
            Financial Reporting, Insurance &amp; Treasury Specialist
          </p>
        </div>
      </section>

      {/* Career growth */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Career Growth</p>

          <h2 style={sectionHeadingStyle}>
            Turning an Internship Into a Full-Time Career
          </h2>

          <p style={bodyStyle}>
            Travis described the internship as priceless because of the
            professional and personal growth he gained through APC and Mazda
            Toyota Manufacturing.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            His successful internship led to a full-time position as an
            Accounting &amp; Finance Specialist at Mazda Toyota Manufacturing.
            In that role, he became responsible for revenue recognition,
            accounts receivable, and accounting policies.
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
          Learn how APC internships help students build practical skills,
          improve business processes, and launch successful careers.
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

function DetailRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      style={{
        padding: '13px 0',
        borderBottom: isLast ? 'none' : '1px solid #E5E7EB',
      }}
    >
      <p style={detailLabelStyle}>{label}</p>
      <p style={detailValueStyle}>{value}</p>
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

const introGridStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1080px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 0.6fr)',
  gap: '44px',
  alignItems: 'start',
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

const profileCardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '2px solid #9E1B32',
  borderRadius: '12px',
  padding: '26px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
};

const profileHeadingStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.3rem',
  fontWeight: 700,
  margin: '0 0 8px',
};

const detailLabelStyle: CSSProperties = {
  color: '#6B7280',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.84rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: '0 0 3px',
};

const detailValueStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1rem',
  lineHeight: 1.45,
  margin: 0,
};

const impactSectionStyle: CSSProperties = {
  backgroundColor: '#35363B',
  padding: '54px 24px',
};

const impactContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '720px',
  margin: '0 auto',
  textAlign: 'center',
};

const impactCardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: '36px 24px',
  borderBottom: '6px solid #9E1B32',
};

const impactValueStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
  fontWeight: 700,
  lineHeight: 1,
  margin: '0 0 12px',
};

const impactLabelStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.08rem',
  fontWeight: 600,
  lineHeight: 1.5,
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
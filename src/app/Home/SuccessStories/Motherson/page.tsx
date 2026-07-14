import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const impacts = [
  {
    value: '500+',
    label: 'Workstations Analyzed',
  },
  {
    value: '15',
    label: 'UA Student Interns',
  },
  {
    value: '$6.8M',
    label: 'Expected Annual Savings',
  },
  {
    value: '$7.37M',
    label: 'Estimated Total Impact',
  },
];

export default function MothersonSuccessStoryPage() {
  return (
    <main
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Motherson"
        backgroundImage="/images/MothersonInterns.jpg"
        backgroundPosition="center 25%"
        height="22em"
      />

      {/* Intro */}
      <section style={whiteSectionStyle}>
        <div style={introGridStyle}>
          <div>
            <p style={eyebrowStyle}>APC Consulting Success Story</p>

            <h1 style={sectionHeadingStyle}>
              Time Studies Supporting Continuous Improvement
            </h1>

            <p style={bodyStyle}>
              APC performed standard and methods-time measurement studies for
              three Motherson plants located in Cottondale and Vance, Alabama.
              Motherson is a major tier-one supplier to Mercedes-Benz U.S.
              International and produces injection-molded components including
              bumpers, door panels, rocker panels, running boards, spoilers,
              and other automotive parts.
            </p>

            <p style={bodyStyle}>
              These components are produced in a Just-in-Time and In-Sequence
              environment. Many parts are manufactured, delivered, and
              installed on a finished Mercedes-Benz vehicle on the same day
              they are ordered. The sequence of parts shipped by Motherson must
              match the exact order of vehicles being assembled, including the
              model, selected options, and exterior colors.
            </p>
          </div>

          <aside style={overviewCardStyle}>
            <h2 style={cardHeadingStyle}>Project Overview</h2>

            <DetailRow label="Client" value="Motherson" />
            <DetailRow
              label="Locations"
              value="Cottondale and Vance, Alabama"
            />
            <DetailRow
              label="Industry"
              value="Automotive Manufacturing"
            />
            <DetailRow
              label="Project"
              value="Time Studies and Process Improvement"
            />
            <DetailRow
              label="Participants"
              value="15 University of Alabama interns"
              isLast
            />
          </aside>
        </div>
      </section>

      {/* Challenge and approach */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>The Challenge</p>

          <h2 style={sectionHeadingStyle}>
            Evaluating Improvements Without Interrupting Production
          </h2>

          <p style={bodyStyle}>
            Mercedes-Benz requires suppliers to maintain a constant flow of
            parts to the final assembly line without interruption. This creates
            a challenge for suppliers that want to test process improvements,
            rebalance work, or introduce cost-saving changes while protecting
            production continuity.
          </p>

          <p style={bodyStyle}>
            Motherson partnered with APC to create a more accurate picture of
            how work was being performed throughout its facilities. APC began
            by conducting standard time studies for each assembly line.
          </p>

          <p style={bodyStyle}>
            Once the standard studies were complete, Motherson requested a more
            detailed methods-time measurement analysis using the Maynard
            Operational Sequence Technique, commonly known as M.O.S.T.
          </p>

          <p style={bodyStyle}>
            APC analyzed more than 500 workstations. Each required movement was
            broken down into small details, including steps taken, tools or
            parts grasped, components positioned, and pieces snapped together.
          </p>
        </div>
      </section>

      {/* Charts */}
      <section style={whiteSectionStyle}>
        <div style={wideContainerStyle}>
          <div style={chartIntroStyle}>
            <p style={eyebrowStyle}>Project Deliverables</p>

            <h2 style={sectionHeadingStyle}>
              Visual Tools for Process Analysis
            </h2>

            <p style={bodyStyle}>
              APC applied M.O.S.T. using a custom-developed tool that
              automatically produced Yamazumi charts, value-added and
              non-value-added reports, and standardized work combination
              charts.
            </p>
          </div>

          <div style={chartGridStyle}>
            <figure style={figureStyle}>
              <Image
                src="/images/MothersonGraph1.png"
                alt="Motherson Yamazumi chart"
                width={1400}
                height={900}
                style={chartImageStyle}
              />

              <figcaption style={captionStyle}>
                Yamazumi chart showing work elements across assembly stations.
              </figcaption>
            </figure>

            <figure style={figureStyle}>
              <Image
                src="/images/MothersonGraph3.png"
                alt="Motherson value-added versus non-value-added chart"
                width={1400}
                height={800}
                style={chartImageStyle}
              />

              <figcaption style={captionStyle}>
                Value-added and non-value-added analysis used to identify
                improvement opportunities.
              </figcaption>
            </figure>
          </div>

          <figure
            style={{
              ...figureStyle,
              marginTop: '28px',
            }}
          >
            <Image
              src="/images/MothersonGraph2.png"
              alt="Motherson standardized work combination table"
              width={1600}
              height={700}
              style={wideChartImageStyle}
            />

            <figcaption style={captionStyle}>
              Standardized work combination analysis showing manual work,
              walking, waiting, and machine time.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Training */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Long-Term Use</p>

          <h2 style={sectionHeadingStyle}>
            Supporting Continuous Improvement at Motherson
          </h2>

          <p style={bodyStyle}>
            APC designed the time studies to function as living documents.
            More than a dozen Motherson employees were trained in both M.O.S.T.
            and the custom APC tool so the company could continue updating the
            studies and evaluating future changes.
          </p>

          <p style={bodyStyle}>
            Motherson has already used the findings to re-evaluate the
            installation of a new assembly line before construction was
            complete, with plans to increase its investment by approximately
            $350,000.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            The project also gave fifteen University of Alabama student interns
            from varied academic backgrounds hands-on experience with time
            studies, M.O.S.T., manufacturing systems, process improvement, and
            automotive production in Alabama.
          </p>
        </div>
      </section>

      {/* Impacts */}
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
          Discover how APC connects Alabama organizations with university
          expertise, student talent, and practical improvement solutions.
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
        padding: '12px 0',
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
  padding: '56px 24px',
};

const lightSectionStyle: CSSProperties = {
  backgroundColor: '#F2F3F4',
  padding: '56px 24px',
};

const introGridStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1120px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 0.75fr)',
  gap: '44px',
  alignItems: 'start',
};

const textContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
};

const wideContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
};

const chartIntroStyle: CSSProperties = {
  maxWidth: '850px',
  marginBottom: '30px',
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

const cardHeadingStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.35rem',
  fontWeight: 700,
  margin: '0 0 10px',
};

const bodyStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.08rem',
  lineHeight: 1.72,
  marginTop: 0,
  marginBottom: '17px',
};

const overviewCardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '2px solid #9E1B32',
  borderRadius: '14px',
  padding: '28px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
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
  margin: 0,
};

const chartGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '28px',
};

const figureStyle: CSSProperties = {
  margin: 0,
};

const chartImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '320px',
  objectFit: 'contain',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
};

const wideChartImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '360px',
  objectFit: 'contain',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
};

const captionStyle: CSSProperties = {
  color: '#5F6368',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.92rem',
  lineHeight: 1.5,
  marginTop: '10px',
};

const impactSectionStyle: CSSProperties = {
  backgroundColor: '#35363B',
  padding: '56px 24px',
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

const ctaSectionStyle: CSSProperties = {
  backgroundColor: '#F2F3F4',
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
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const impacts = [
  {
    value: '$320,141',
    label: 'IAC Cost Savings',
  },
  {
    value: '$60,000+',
    label: 'Avoided Safety Costs',
  },
  {
    value: '$57,242',
    label: 'Overtime Reduction',
  },
  {
    value: '$437,383+',
    label: 'Combined Financial Impact',
  },
];

export default function AlabamaStrongSuccessStoryPage() {
  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Alabama STRONG"
        backgroundImage="/images/SSCCHeader.jpg"
        backgroundPosition="center 45%"
        height="21em"
      />

      {/* Introduction */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Spring 2021 Collaborative Internship</p>

          <h1 style={sectionHeadingStyle}>
            Connecting University and Community College Students With Industry
          </h1>

          <p style={bodyStyle}>
            The Alabama Productivity Center and Shelton State Community College
            collaborated to support the ARC Alabama STRONG Internship Program
            during the Spring 2021 semester.
          </p>

          <p style={bodyStyle}>
            The pilot program placed two students from each institution with
            Alabama automotive manufacturers. The internships were designed to
            provide work-based learning experiences that complemented each
            student’s academic training while also giving them the opportunity
            to collaborate with students from different institutions and
            disciplines.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            The participating companies were Samvardhana Motherson Peguform,
            also known as SMP Automotive, and International Automotive
            Components Group. Both companies assigned the interns continuous
            improvement projects that supported operational goals.
          </p>
        </div>
      </section>

      {/* Students */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <div>
            <p style={eyebrowStyle}>Student Teams</p>

            <h2 style={sectionHeadingStyle}>
              Four Students, Two Institutions, Two Companies
            </h2>

            <p style={bodyStyle}>
              The internship began on January 11, 2021, with two students from
              Shelton State Community College and two students from The
              University of Alabama.
            </p>

            <div style={studentListStyle}>
              <Student
                name="Jonah Williams"
                school="Shelton State Community College"
                major="Industrial Electronics and Electrical Technology"
                company="IAC Group"
              />

              <Student
                name="Jordan Cash"
                school="Shelton State Community College"
                major="Machine Tool Technology"
                company="SMP Automotive"
              />

              <Student
                name="Britt Ryan"
                school="The University of Alabama"
                major="Mechanical Engineering"
                company="IAC Group"
              />

              <Student
                name="Spencer Martin"
                school="The University of Alabama"
                major="Master’s in Mechanical Engineering"
                company="SMP Automotive"
                isLast
              />
            </div>
          </div>

          <Image
            src="/images/SSCC1.jpg"
            alt="Automotive body panels in a manufacturing facility"
            width={1000}
            height={700}
            style={sideImageStyle}
          />
        </div>
      </section>

      {/* IAC Project */}
      <section style={whiteSectionStyle}>
        <div style={contentGridStyle}>
          <Image
            src="/images/SSCC3.jpg"
            alt="Manufacturing personnel inspecting an industrial facility"
            width={1000}
            height={700}
            style={sideImageStyle}
          />

          <div>
            <p style={eyebrowStyle}>IAC Group Project</p>

            <h2 style={sectionHeadingStyle}>
              Improving Robotic Operations on the FlexLine
            </h2>

            <p style={bodyStyle}>
              Jonah Williams and Britt Ryan worked with IAC Group to improve
              the timing of robotic operations on the FlexLine, where automotive
              door panels are produced.
            </p>

            <p style={bodyStyle}>
              After conducting time studies and monitoring the line, the interns
              determined that the primary bottleneck occurred during the
              welding process, specifically at the first weld station.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Jonah and Britt reprogrammed several welding points and helped
              rebalance the production line. These changes resulted in an
              estimated cost savings of $320,141.
            </p>
          </div>
        </div>
      </section>

      {/* SMP Project */}
      <section style={lightSectionStyle}>
        <div style={contentGridStyle}>
          <div>
            <p style={eyebrowStyle}>SMP Automotive Project</p>

            <h2 style={sectionHeadingStyle}>
              Developing Standard Work and Tooling Improvements
            </h2>

            <p style={bodyStyle}>
              Jordan Cash and Spencer Martin were assigned process improvement
              work in the SMP tooling department.
            </p>

            <p style={bodyStyle}>
              The interns developed standard work for cleaning and repairing
              tooling used in injection molds. Using SolidWorks, they also
              designed handles, magnetic tool tips, and mill stops for use in
              production and the tool shop.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Their work produced at least $60,000 in avoided safety costs and
              reduced overtime costs by $57,242.
            </p>
          </div>

          <Image
            src="/images/SSCC2.jpg"
            alt="Engineering plans and measurement tools used for manufacturing design"
            width={1000}
            height={700}
            style={sideImageStyle}
          />
        </div>
      </section>

      {/* Collaboration */}
      <section style={whiteSectionStyle}>
        <div style={contentGridStyle}>
          <Image
            src="/images/SSCCHeader.jpg"
            alt="Industrial robot and manufacturing controls"
            width={1000}
            height={700}
            style={sideImageStyle}
          />

          <div>
            <p style={eyebrowStyle}>Collaborative Learning</p>

            <h2 style={sectionHeadingStyle}>
              Learning Across Institutions and Disciplines
            </h2>

            <p style={bodyStyle}>
              The program gave the interns an opportunity to combine different
              technical backgrounds and share knowledge with their teammates.
              Students gained hands-on experience with robotics, manufacturing
              systems, time studies, tooling, SolidWorks, and continuous
              improvement.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              The collaboration also demonstrated how universities, community
              colleges, and manufacturers can work together to create valuable
              workforce-development experiences.
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
              Financial Impact
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

      {/* Conclusion */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Program Success</p>

          <h2 style={sectionHeadingStyle}>
            A Model for Future Collaborative Internships
          </h2>

          <p style={bodyStyle}>
            The pilot program was successful for the students, participating
            companies, and educational institutions. SMP Automotive and IAC
            management expressed interest in participating in similar
            internships in the future.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            The interns enjoyed sharing their skills and learning from their
            teammates, and APC began discussions with the Alabama Community
            College System about expanding this type of collaboration into
            other areas.
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
          Learn how APC connects students, educational institutions, and
          Alabama manufacturers through applied internship projects.
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

function Student({
  name,
  school,
  major,
  company,
  isLast = false,
}: {
  name: string;
  school: string;
  major: string;
  company: string;
  isLast?: boolean;
}) {
  return (
    <div
      style={{
        padding: '14px 0',
        borderBottom: isLast ? 'none' : '1px solid #D1D5DB',
      }}
    >
      <p style={studentNameStyle}>{name}</p>

      <p style={studentDetailStyle}>
        {school}
      </p>

      <p style={studentDetailStyle}>
        {major}
      </p>

      <p style={studentCompanyStyle}>
        Assigned to {company}
      </p>
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
  maxWidth: '1180px',
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
  borderRadius: '10px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.10)',
};

const studentListStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderLeft: '5px solid #9E1B32',
  padding: '4px 24px',
  marginTop: '24px',
};

const studentNameStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.1rem',
  fontWeight: 700,
  margin: '0 0 4px',
};

const studentDetailStyle: CSSProperties = {
  color: '#5F6368',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.96rem',
  lineHeight: 1.45,
  margin: '0 0 2px',
};

const studentCompanyStyle: CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.94rem',
  fontWeight: 700,
  margin: '5px 0 0',
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
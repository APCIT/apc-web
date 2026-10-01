import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function CommerceSuccessStoryPage() {
  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Alabama Department of Commerce"
        backgroundImage="/images/CommerceHeader.jpg"
        backgroundPosition="center 18%"
        height="21em"
      />

      {/* Background */}
      <section style={whiteSectionStyle}>
        <div style={introGridStyle}>
          <div style={logoWrapStyle}>
            <Image
              src="/images/Logos/commerce.png"
              alt="Alabama Department of Commerce Made in Alabama logo"
              width={520}
              height={220}
              style={logoStyle}
              priority
            />
          </div>

          <div>
            <p style={eyebrowStyle}>Background</p>

            <h1 style={sectionHeadingStyle}>
              APC Helps Alabama Department of Commerce Achieve ISO 9001
              Certification
            </h1>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              The Alabama Productivity Center (APC) worked with the Alabama
              Department of Commerce (Commerce) for a year and a half to develop
              the systems, processes, and documentation needed to achieve ISO
              9001:2015 certification. ISO 9001 is an internationally recognized
              standard for quality management systems focused on consistent
              processes and continual improvement.
            </p>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>The Challenge</p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            Commerce sought to establish a comprehensive quality management
            system (QMS) across its primary operations, including Project
            Management, Small Business, Global Business, Entertainment, and
            other support departments. APC started the project with a Gap
            Analysis of each department to identify areas requiring development
            or improvement to meet ISO 9001 requirements.
          </p>
        </div>
      </section>

      {/* APC's Approach */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>APC&apos;s Approach</p>

          <p style={bodyStyle}>
            APC provided comprehensive technical assistance with professional
            staff and a graduate student intern who worked for three semesters.
            APC built Commerce&apos;s quality management system from the ground
            up, developing process flows, a quality manual, the quality policy
            and objectives, training matrix, document control procedures and
            logs, corrective action forms, needs and expectations matrix,
            organizational structure, audit schedules and reports, management
            review forms, and other required components.
          </p>

          <p style={bodyStyle}>
            The process flows were built off an already detailed process flow in
            place at Commerce. Alan Hill, APC Director, commented, &ldquo;The
            Department of Commerce has been dedicated to serving the state of
            Alabama long before they began the ISO 9001 implementation. This
            certification will now serve as a testament to the great work they
            do.&rdquo;
          </p>
        </div>

        <div style={contentGridStyle}>
          <div>
            <p style={bodyStyle}>
              APC completed the work collaboratively through regular meetings
              with Commerce staff. APC developed and refined each process and
              document based on employee feedback, ensuring the system met the
              standard while fitting Commerce&apos;s operations. Intern Jacob
              Novak, a student from Culverhouse&apos;s Manderson Graduate School
              MBA program, played a significant role in developing and organizing
              the documentation, with ongoing guidance and support from APC
              professional staff. Ed Castile, Commerce Quality Manager, noted:
              &ldquo;APC created all the required ISO documents, forms, and
              procedures required by the ISO Standard and guided our Commerce
              Team every step of the way.&rdquo;
            </p>
          </div>

          <Image
            src="/images/CommerceIntern.jpg"
            alt="APC intern Jacob Novak speaking at the Alabama Center for Commerce"
            width={900}
            height={1200}
            style={portraitImageStyle}
          />
        </div>

        <div style={{ ...contentGridStyle, marginTop: '42px' }}>
          <Image
            src="/images/CommerceCeremony.jpg"
            alt="ISO 9001 training certification ceremony in Montgomery, Alabama"
            width={900}
            height={1200}
            style={portraitImageStyle}
          />

          <div>
            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              APC also trained 25 Commerce employees on ISO 9001 requirements
              and provided Internal Auditor training to selected employees. APC
              staff, including Justin Rodgers, Susan Maples, and Ben Baxter,
              then conducted Commerce&apos;s first internal audit alongside
              Commerce staff, helping prepare the organization for its
              certification audit.
            </p>
          </div>
        </div>
      </section>

      {/* The Result */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>The Result</p>

          <p style={bodyStyle}>
            APC staff participated in Commerce&apos;s Stage 1 and Stage 2
            audits, providing assistance and support throughout both audits. In
            August 2026, the Alabama Department of Commerce received
            &ldquo;Unconditional Approval&rdquo; to receive ISO 9001:2015
            certification, making Alabama the only state in the United States
            with this distinction. &ldquo;The Alabama Department of Commerce is
            proud to achieve ISO 9001:2015 certification, a significant
            milestone that reflects our commitment to operational excellence,
            accountability and continuous improvement,&rdquo; Commerce Secretary
            Ellen McNair said.
          </p>

          <p style={bodyStyle}>
            &ldquo;This achievement represents the dedication of our Commerce
            team and the tremendous partnership we received from the Alabama
            Productivity Center. Over the course of this effort, APC worked
            closely with our employees to strengthen our processes, establish a
            comprehensive quality management system and build a framework that
            will help us continually improve the way we serve Alabama businesses
            and communities.&rdquo;
          </p>

          <p style={bodyStyle}>
            The registrar auditor identified Commerce&apos;s QMS documentation
            as a strength, saying, &ldquo;I am very impressed that you have such
            highly developed documentation to be such a new system.&rdquo;
          </p>

          <p style={bodyStyle}>
            &ldquo;Commerce was assisted by the University of Alabama
            Productivity Center&apos;s Alan Hill, Morgan Harrison, and their
            exceptional team. With the APC team&apos;s help and utilization of
            their internship program, Commerce gained certification,&rdquo; Ed
            Castile, Commerce Quality Manager, continued.
          </p>

          <p style={bodyStyle}>
            Beyond certification, APC&apos;s work strengthened
            cross-departmental communication and established a structured
            process for Commerce employees to identify and implement process
            improvements. &ldquo;The Department of Commerce has the utmost
            commitment to providing exceptional service in all they do. It was
            an honor for APC to work alongside them for this meaningful
            project,&rdquo; commented Morgan Harrison, APC Productivity Engineer.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            The resulting system provides Alabama with a standardized,
            continually improving approach to economic development operations,
            giving industries another reason to have confidence in
            Alabama&apos;s ability to support their growth. Governor Kay Ivey
            stated, &ldquo;This certification reinforces what we in Alabama
            already know — the Alabama Department of Commerce&apos;s management
            systems, professionalism and reliability are second to none.&rdquo;
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
          Learn how APC partners with Alabama organizations to strengthen
          processes, quality systems, and operational performance.
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
  gridTemplateColumns: 'minmax(220px, 0.85fr) minmax(0, 1.15fr)',
  gap: '42px',
  alignItems: 'center',
};

const contentGridStyle: CSSProperties = {
  width: '100%',
  maxWidth: '1080px',
  margin: '36px auto 0',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(260px, 0.85fr)',
  gap: '42px',
  alignItems: 'center',
};

const logoWrapStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const logoStyle: CSSProperties = {
  width: '100%',
  maxWidth: '360px',
  height: 'auto',
  objectFit: 'contain',
};

const portraitImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  maxWidth: '420px',
  height: 'auto',
  margin: '0 auto',
  objectFit: 'contain',
  borderRadius: '10px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.10)',
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

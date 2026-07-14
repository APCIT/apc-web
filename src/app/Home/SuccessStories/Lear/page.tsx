import Image from 'next/image';
import Link from 'next/link';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const projects = [
  {
    title: 'AI Automation',
    description:
      'Trained on new software and led the team in implementing file automation using Palantir Foundry. The automated process reduced the time spent updating and configuring files used to help predict obsolescence.',
  },
  {
    title: 'Bills of Materials Alerts',
    description:
      'Researched part numbers, descriptions, and timelines for engineering and part changes, then communicated bills of materials alerts to the appropriate parties.',
  },
  {
    title: 'Engineering Change and Lear Parts Audits',
    description:
      'Performed audits on lists containing missing parts and codes and coordinated with the responsible teams to locate the missing information and develop solutions.',
  },
];

const impacts = [
  {
    value: '$29,184',
    label: 'Time and Cost Reduction',
  },
  {
    value: '$24,280',
    label: 'Investments',
  },
  {
    value: '$53,464',
    label: 'Total Impacts',
  },
];

export default function LearSuccessStoryPage() {
  return (
    <main
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="Lear Corporation"
        backgroundImage="/images/LearCar.jpg"
        backgroundPosition="center"
        height="24em"
      />

      {/* Introduction */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '64px 24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1150px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '48px',
          }}
        >
          <div
            style={{
              flex: '1 1 300px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/images/LearLogo.jpg"
              alt="Lear Corporation logo"
              width={500}
              height={180}
              style={{
                width: '100%',
                maxWidth: '420px',
                height: 'auto',
                objectFit: 'contain',
              }}
              priority
            />
          </div>

          <div style={{ flex: '1.5 1 500px' }}>
            <p style={eyebrowStyle}>APC Internship Success Story</p>

            <h1 style={sectionHeadingStyle}>
              Improving Engineering Processes Through Automation
            </h1>

            <p style={bodyStyle}>
              Lear is a global automotive technology leader in Seating and
              E-Systems that creates safer, smarter, and more comfortable
              in-vehicle experiences. Headquartered in Southfield, Michigan,
              Lear serves every major automaker and operates in 38 countries.
            </p>

            <p style={bodyStyle}>
              Lear Corporation locations in Alabama have partnered with the
              Alabama Productivity Center for several years to provide
              meaningful internship opportunities to university students.
            </p>
          </div>
        </div>
      </section>

      {/* Intern overview */}
      <section style={lightSectionStyle}>
        <div style={contentContainerStyle}>
          <div style={{ flex: '1.4 1 520px' }}>
            <p style={eyebrowStyle}>Summer 2024 Internship</p>

            <h2 style={sectionHeadingStyle}>
              Real-World Experience at Lear Corporation
            </h2>

            <p style={bodyStyle}>
              After completing her sophomore year, University of Alabama
              Operations Management student Anabelle Zuluaga joined Lear
              Corporation in Cottondale, Alabama.
            </p>

            <p style={bodyStyle}>
              During her internship in the Engineering Change Department,
              Anabelle supported engineering change processes, performed data
              audits, communicated important parts information, and helped
              introduce artificial intelligence automation into the
              department’s workflow.
            </p>
          </div>

          <div
            style={{
              flex: '1 1 380px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #9E1B32',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 5px 18px rgba(0, 0, 0, 0.10)',
            }}
          >
            <h3 style={cardHeadingStyle}>Internship Details</h3>

            <DetailRow label="Student" value="Anabelle Zuluaga" />
            <DetailRow
              label="University"
              value="The University of Alabama"
            />
            <DetailRow label="Major" value="Operations Management" />
            <DetailRow
              label="College"
              value="Culverhouse College of Business"
            />
            <DetailRow label="Location" value="Cottondale, Alabama" />
            <DetailRow
              label="Department"
              value="Engineering Change Department"
              isLast
            />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '72px 24px',
        }}
      >
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div
            style={{
              textAlign: 'center',
              maxWidth: '760px',
              margin: '0 auto 42px',
            }}
          >
            <p style={eyebrowStyle}>Internship Projects</p>
            <h2 style={sectionHeadingStyle}>Anabelle’s Work at Lear</h2>
            <p style={bodyStyle}>
              Anabelle contributed to several projects designed to improve
              communication, data quality, and operational efficiency.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {projects.map((project) => (
              <article
                key={project.title}
                style={{
                  border: '1px solid #D1D5DB',
                  borderTop: '6px solid #9E1B32',
                  borderRadius: '12px',
                  padding: '28px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                }}
              >
                <h3 style={cardHeadingStyle}>{project.title}</h3>
                <p style={{ ...bodyStyle, marginBottom: 0 }}>
                  {project.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Palantir section */}
      <section style={lightSectionStyle}>
        <div style={contentContainerStyle}>
          <div style={{ flex: '1 1 460px' }}>
            <Image
              src="/images/LearGraphic.png"
              alt="Palantir Foundry software data integration diagram"
              width={700}
              height={450}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '10px',
                boxShadow: '0 5px 18px rgba(0, 0, 0, 0.10)',
              }}
            />
          </div>

          <div style={{ flex: '1 1 460px' }}>
            <p style={eyebrowStyle}>Technology and Process Improvement</p>

            <h2 style={sectionHeadingStyle}>
              Supporting AI-Powered Automation
            </h2>

            <p style={bodyStyle}>
              Anabelle trained on Palantir Foundry and helped lead the
              department’s implementation of file automation. The new process
              reduced repetitive file updates and helped prepare information
              used to predict parts obsolescence.
            </p>

            <p style={bodyStyle}>
              This work allowed team members to spend more time on important
              engineering change and model-year transition activities.
            </p>
          </div>
        </div>
      </section>

      {/* Financial impacts */}
      <section
        style={{
          backgroundColor: '#35363B',
          color: '#FFFFFF',
          padding: '72px 24px',
        }}
      >
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '42px' }}>
            <p
              style={{
                ...eyebrowStyle,
                color: '#FFFFFF',
              }}
            >
              Measurable Results
            </p>

            <h2
              style={{
                ...sectionHeadingStyle,
                color: '#FFFFFF',
              }}
            >
              Financial Impact
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            {impacts.map((impact) => (
              <div
                key={impact.label}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#35363B',
                  borderRadius: '12px',
                  padding: '34px 24px',
                  textAlign: 'center',
                  borderBottom: '6px solid #9E1B32',
                }}
              >
                <p
                  style={{
                    color: '#9E1B32',
                    fontFamily: 'proxima-nova, sans-serif',
                    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    margin: '0 0 14px',
                  }}
                >
                  {impact.value}
                </p>

                <p
                  style={{
                    fontFamily: 'proxima-nova, sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {impact.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '72px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '950px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              color: '#9E1B32',
              fontFamily: 'Georgia, serif',
              fontSize: '5rem',
              lineHeight: 0.7,
              marginBottom: '20px',
            }}
          >
            “
          </div>

          <blockquote
            style={{
              color: '#35363B',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: 'clamp(1.25rem, 2.2vw, 1.65rem)',
              fontStyle: 'italic',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Anabelle has been a vital member of the team. She has been
            responsible for the plant&apos;s change notification process,
            making sure responsible parties acknowledge notifications and
            submit documentation in a timely manner. Anabelle has led the team
            in AI integration for the automation of processes. This work will
            save team members time on key tasks regarding model-year
            changeovers. Her performance has been key in driving improvements
            in Lear processes through the integration of AI. She is a great
            employee and has a bright future ahead of her.
          </blockquote>

          <p
            style={{
              color: '#35363B',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 700,
              marginTop: '28px',
              marginBottom: '4px',
            }}
          >
            Konrad Piepke
          </p>

          <p
            style={{
              color: '#5F6368',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Lear Engineering Change Coordinator
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          backgroundColor: '#F2F3F4',
          padding: '56px 24px',
          textAlign: 'center',
          borderTop: '1px solid #D1D5DB',
        }}
      >
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
            margin: '0 auto 28px',
          }}
        >
          Learn how APC internships and consulting projects create meaningful
          experiences for students and measurable results for Alabama
          organizations.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
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
        padding: '14px 0',
        borderBottom: isLast ? 'none' : '1px solid #E5E7EB',
      }}
    >
      <p
        style={{
          color: '#6B7280',
          fontFamily: 'proxima-nova, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: '0 0 4px',
        }}
      >
        {label}
      </p>

      <p
        style={{
          color: '#35363B',
          fontFamily: 'proxima-nova, sans-serif',
          fontSize: '1.05rem',
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}

const contentContainerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '1150px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '48px',
};

const lightSectionStyle: React.CSSProperties = {
  backgroundColor: '#F2F3F4',
  padding: '72px 24px',
};

const eyebrowStyle: React.CSSProperties = {
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.95rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  margin: '0 0 12px',
};

const sectionHeadingStyle: React.CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
  fontWeight: 700,
  lineHeight: 1.15,
  margin: '0 0 24px',
};

const cardHeadingStyle: React.CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.4rem',
  fontWeight: 700,
  lineHeight: 1.25,
  margin: '0 0 14px',
};

const bodyStyle: React.CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.1rem',
  lineHeight: 1.75,
  marginTop: 0,
  marginBottom: '18px',
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#9E1B32',
  color: '#FFFFFF',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.05rem',
  fontWeight: 700,
  textDecoration: 'none',
  border: '2px solid #9E1B32',
  borderRadius: '4px',
  padding: '13px 24px',
};

const secondaryButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#FFFFFF',
  color: '#9E1B32',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.05rem',
  fontWeight: 700,
  textDecoration: 'none',
  border: '2px solid #9E1B32',
  borderRadius: '4px',
  padding: '13px 24px',
};
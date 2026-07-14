import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

const impacts = [
  {
    value: '$228,685',
    label: 'Retained Sales',
  },
  {
    value: '$25,000',
    label: 'Jobs Created',
  },
  {
    value: '$250,240',
    label: 'Avoided Investments',
  },
  {
    value: '$503,925',
    label: 'Total Impact',
  },
];

const testimonials = [
  {
    quote:
      'This past year I was granted the opportunity to intern with the Alabama Productivity Center as their marketing intern, and I could not be more grateful for the experience it has provided me. Working alongside other interns, I was able to receive hands-on experience from numerous projects ranging from graphic design to web development.',
    name: 'Shaelin Jones',
    role: 'Marketing Intern',
  },
  {
    quote:
      'Through the projects I completed at the APC, I was able to learn relevant programming skills that I am still able to apply today at other companies. Working at the APC will teach you more than just how to be a programmer. You will learn skills in database management, project management, marketing, and improving business workflows.',
    name: 'Jared Waller',
    role: 'MIS Intern',
  },
  {
    quote:
      'During my time as an intern at the Alabama Productivity Center, I was able to gain valuable work experience in the web development field. APC also gave me the chance to network and grow as an individual, which will ultimately help me with my future in the IT field.',
    name: 'Noah Yoshida',
    role: 'MIS Intern',
  },
];

export default function APCWebsiteRedesignPage() {
  return (
    <main
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: '#F2F3F4' }}
    >
      <HeadingIntroBanner
        title="APC Website Redesign"
        backgroundImage="/images/APCSuccessStoryHeader.jpg"
        backgroundPosition="center 12%"
        height="21em"
      />

      {/* Situation */}
      <section style={whiteSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>Internship Success Story</p>

          <h1 style={sectionHeadingStyle}>
            Redesigning the Alabama Productivity Center Website
          </h1>

          <p style={bodyStyle}>
            The Alabama Productivity Center identified the need to redesign
            both the front-end and back-end of its website. The previous site
            had been created by earlier in-house MIS interns, but its
            single-page structure was no longer meeting the center’s needs.
          </p>

          <p style={bodyStyle}>
            Visitors had to scroll through one long page to locate information,
            and the site lacked clear calls to action for important tasks such
            as registering for classes, applying for internships, and
            contacting APC.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            APC envisioned a multi-page website that would organize information
            more clearly, highlight internships and professional services, and
            make it easier for visitors to take the next step.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section style={lightSectionStyle}>
        <div style={textContainerStyle}>
          <p style={eyebrowStyle}>The Solution</p>

          <h2 style={sectionHeadingStyle}>
            Combining Web Development and Marketing
          </h2>

          <p style={bodyStyle}>
            APC paired MIS interns Jared Waller and Noah Yoshida with marketing
            intern Shaelin Jones. This collaboration combined technical
            development skills with visual design and user-experience planning.
          </p>

          <p style={bodyStyle}>
            Shaelin developed site maps and page layouts, while Jared and Noah
            implemented those ideas using C#, HTML5, CSS, JavaScript, jQuery,
            Bootstrap, SQL, and ASP.NET.
          </p>

          <p style={bodyStyle}>
            Together, the interns created seven pages: Home, About Us, Client
            Services, Internships, Success Stories, Locations, and News. Each
            page became accessible through a primary navigation bar, removing
            the need for visitors to search through one long page.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            The redesign also introduced stronger imagery, clearer calls to
            action, an Advisory Board directory, and a dedicated Success
            Stories page.
          </p>
        </div>
      </section>

      {/* Before and after */}
      <section style={whiteSectionStyle}>
        <div style={wideContainerStyle}>
          <div style={sectionIntroStyle}>
            <p style={eyebrowStyle}>Before and After</p>

            <h2 style={sectionHeadingStyle}>
              A More Organized and Usable Website
            </h2>
          </div>

          <div style={comparisonGridStyle}>
            <figure style={figureStyle}>
              <Image
                src="/images/APCOldSiteScreenshot.png"
                alt="Previous single-page Alabama Productivity Center website"
                width={700}
                height={1900}
                style={oldSiteImageStyle}
              />

              <figcaption style={captionStyle}>
                Previous APC website: a single long page requiring extensive
                scrolling.
              </figcaption>
            </figure>

            <div style={afterGridStyle}>
              <figure style={figureStyle}>
                <Image
                  src="/images/APCNewSite1.png"
                  alt="Redesigned Alabama Productivity Center home page"
                  width={800}
                  height={1500}
                  style={newSiteImageStyle}
                />

                <figcaption style={captionStyle}>
                  Redesigned home page with clearer navigation, impact numbers,
                  and calls to action.
                </figcaption>
              </figure>

              <figure style={figureStyle}>
                <Image
                  src="/images/APCNewSite2.png"
                  alt="Redesigned Alabama Productivity Center About Us page"
                  width={800}
                  height={1700}
                  style={newSiteImageStyle}
                />

                <figcaption style={captionStyle}>
                  Redesigned About Us page featuring staff and Advisory Board
                  directories.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={lightSectionStyle}>
        <div style={wideContainerStyle}>
          <div style={sectionIntroStyle}>
            <p style={eyebrowStyle}>Intern Experience</p>

            <h2 style={sectionHeadingStyle}>
              Building Skills Through Collaboration
            </h2>
          </div>

          <div style={testimonialGridStyle}>
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.name}
                style={testimonialCardStyle}
              >
                <p style={quoteStyle}>“{testimonial.quote}”</p>

                <footer>
                  <p style={quoteNameStyle}>{testimonial.name}</p>
                  <p style={quoteRoleStyle}>{testimonial.role}</p>
                </footer>
              </blockquote>
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
          Learn how APC internships give students practical experience while
          helping organizations improve their operations and technology.
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
  maxWidth: '1180px',
  margin: '0 auto',
};

const sectionIntroStyle: CSSProperties = {
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

const bodyStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1.08rem',
  lineHeight: 1.72,
  marginTop: 0,
  marginBottom: '17px',
};

const comparisonGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(220px, 0.55fr) minmax(0, 1.45fr)',
  gap: '28px',
  alignItems: 'start',
};

const afterGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '24px',
};

const figureStyle: CSSProperties = {
  margin: 0,
};

const oldSiteImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '520px',
  objectFit: 'contain',
  objectPosition: 'top',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
};

const newSiteImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '520px',
  objectFit: 'contain',
  objectPosition: 'top',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
};

const captionStyle: CSSProperties = {
  color: '#5F6368',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.9rem',
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

const testimonialGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '22px',
};

const testimonialCardStyle: CSSProperties = {
  margin: 0,
  backgroundColor: '#FFFFFF',
  borderTop: '5px solid #9E1B32',
  borderRadius: '10px',
  padding: '26px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
};

const quoteStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1rem',
  lineHeight: 1.65,
  fontStyle: 'italic',
  margin: '0 0 20px',
};

const quoteNameStyle: CSSProperties = {
  color: '#35363B',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '1rem',
  fontWeight: 700,
  margin: '0 0 3px',
};

const quoteRoleStyle: CSSProperties = {
  color: '#6B7280',
  fontFamily: 'proxima-nova, sans-serif',
  fontSize: '0.92rem',
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
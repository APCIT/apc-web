'use client';

import React, { useEffect, useState } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

/** Same figures as the createaclickablemap.com county popups (map id 94591). */
const SERVED_COUNTIES = [
  { county: 'Baldwin', companies: 2, trained: 21, interns: 0 },
  { county: 'Bibb', companies: 1, trained: 0, interns: 0 },
  { county: 'Blount', companies: 1, trained: 0, interns: 0 },
  { county: 'Butler', companies: 1, trained: 6, interns: 0 },
  { county: 'Calhoun', companies: 1, trained: 10, interns: 0 },
  { county: 'Chilton', companies: 1, trained: 1, interns: 0 },
  { county: 'Clarke', companies: 1, trained: 43, interns: 0 },
  { county: 'Coffee', companies: 1, trained: 40, interns: 0 },
  { county: 'Colbert', companies: 2, trained: 23, interns: 1 },
  { county: 'Crenshaw', companies: 2, trained: 36, interns: 0 },
  { county: 'Cullman', companies: 2, trained: 5, interns: 0 },
  { county: 'DeKalb', companies: 1, trained: 18, interns: 0 },
  { county: 'Fayette', companies: 1, trained: 0, interns: 0 },
  { county: 'Franklin', companies: 1, trained: 1, interns: 0 },
  { county: 'Greene', companies: 1, trained: 0, interns: 0 },
  { county: 'Hale', companies: 1, trained: 20, interns: 1 },
  { county: 'Jackson', companies: 1, trained: 4, interns: 5 },
  { county: 'Jefferson', companies: 47, trained: 163, interns: 95 },
  { county: 'Lee', companies: 2, trained: 33, interns: 1 },
  { county: 'Limestone', companies: 1, trained: 14, interns: 0 },
  { county: 'Madison', companies: 5, trained: 4, interns: 44 },
  { county: 'Marengo', companies: 2, trained: 0, interns: 1 },
  { county: 'Marshall', companies: 6, trained: 30, interns: 0 },
  { county: 'Mobile', companies: 30, trained: 1269, interns: 55 },
  { county: 'Montgomery', companies: 2, trained: 0, interns: 1 },
  { county: 'Morgan', companies: 1, trained: 24, interns: 0 },
  { county: 'Shelby', companies: 9, trained: 6, interns: 12 },
  { county: 'Talladega', companies: 3, trained: 0, interns: 0 },
  { county: 'Tuscaloosa', companies: 68, trained: 299, interns: 329 },
  { county: 'Washington', companies: 1, trained: 57, interns: 1 },
  { county: 'Wilcox', companies: 1, trained: 2, interns: 0 },
] as const;

function formatCount(value: number) {
  return value.toLocaleString('en-US');
}

export default function LocationsPage() {
  const [countyName, setCountyName] = useState('');
  const selected = SERVED_COUNTIES.find((row) => row.county === countyName);

  useEffect(() => {
    // Handle messages from the map iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security (adjust if needed)
      if (event.origin.includes('createaclickablemap.com')) {
        // Handle location redirects if needed
        // The map service may send location data
        console.log('Map message received:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

    const introSectionStyle: React.CSSProperties = {
      backgroundColor: '#F2F3F4',
      padding: '4rem 1.5rem 5rem',
      textAlign: 'center',
    };

    const mainTitleStyle: React.CSSProperties = {
      color: '#9E1B32',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '3rem',
      fontWeight: 800,
      marginBottom: '1rem',
    };

    const accentWrapStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.75rem',
    };

    const crimsonLineStyle: React.CSSProperties = {
      width: '110px',
      height: '6px',
      backgroundColor: '#9E1B32',
    };

    const darkLineStyle: React.CSSProperties = {
      width: '45px',
      height: '6px',
      backgroundColor: '#35363B',
    };

    const introTextStyle: React.CSSProperties = {
      maxWidth: '760px',
      margin: '0 auto 2.75rem',
      color: '#35363B',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '1.35rem',
      lineHeight: 1.6,
    };

    const mapCardStyle: React.CSSProperties = {
      position: 'relative',
      maxWidth: '860px',
      height: '620px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      overflow: 'hidden',
    };

    const iframeStyle: React.CSSProperties = {
      border: 'none',
      width: '100%',
      height: '620px',
      transform: 'scale(1)',
      transformOrigin: 'center',
    };

    const legendStyle: React.CSSProperties = {
      position: 'absolute',
      left: '28px',
      bottom: '28px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      backgroundColor: '#ffffff',
      padding: '0.75rem 1rem',
      zIndex: 10,
    };

    const legendBoxStyle: React.CSSProperties = {
      width: '18px',
      height: '18px',
      backgroundColor: '#9E1B32',
      display: 'inline-block',
    };

    const legendTextStyle: React.CSSProperties = {
      color: '#35363B',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '1.1rem',
      fontWeight: 600,
    };

    const clickIconStyle: React.CSSProperties = {
      width: '54px',
      height: '54px',
      borderRadius: '50%',
      backgroundColor: '#9E1B32',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '2rem auto 1rem',
      fontSize: '1.75rem',
      fontWeight: 800,
    };

    const mapHelpTextStyle: React.CSSProperties = {
      maxWidth: '420px',
      margin: '0 auto',
      color: '#35363B',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '1.15rem',
      lineHeight: 1.5,
    };

    const ctaSectionStyle: React.CSSProperties = {
      backgroundColor: '#212124',
      padding: '3.5rem 1.5rem 4rem',
      textAlign: 'center',
    };

    const ctaTitleStyle: React.CSSProperties = {
      color: '#ffffff',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '1rem',
    };

    const ctaAccentWrapStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '2rem',
    };

    const whiteLineStyle: React.CSSProperties = {
      width: '34px',
      height: '5px',
      backgroundColor: '#ffffff',
    };

    const buttonRowStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      flexWrap: 'wrap',
    };

    const ctaButtonStyle: React.CSSProperties = {
      minWidth: '180px',
      padding: '1rem 2rem',
      color: '#ffffff',
      border: '3px solid #ffffff',
      textDecoration: 'none',
      textTransform: 'uppercase',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '0.90rem',
      fontWeight: 700,
      letterSpacing: '0.03em',
    };

    const lookupCardStyle: React.CSSProperties = {
      maxWidth: '420px',
      margin: '1.75rem auto 0',
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      padding: '1.5rem 1.35rem 1.35rem',
      textAlign: 'left',
    };

    const lookupLabelStyle: React.CSSProperties = {
      display: 'block',
      color: '#35363B',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '0.95rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
    };

    const lookupSelectStyle: React.CSSProperties = {
      width: '100%',
      boxSizing: 'border-box',
      padding: '0.75rem 0.9rem',
      border: '2px solid #35363B',
      backgroundColor: '#ffffff',
      color: '#35363B',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '1.05rem',
    };

    const statsRowStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.75rem',
      marginTop: '1.25rem',
    };

    const statStyle: React.CSSProperties = {
      textAlign: 'center',
    };

    const statValueStyle: React.CSSProperties = {
      color: '#9E1B32',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '1.75rem',
      fontWeight: 800,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1.1,
    };

    const statLabelStyle: React.CSSProperties = {
      color: '#35363B',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '0.85rem',
      fontWeight: 600,
      lineHeight: 1.3,
      marginTop: '0.35rem',
    };

    const lookupHintStyle: React.CSSProperties = {
      color: '#4A4C54',
      fontFamily: 'proxima-nova, sans-serif',
      fontSize: '0.95rem',
      lineHeight: 1.45,
      margin: '1rem 0 0',
    };


    return (
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: '#F2F3F4' }}>
      <HeadingIntroBanner
        title="Locations"
        backgroundImage="/images/Headers/Locations.jpg"
        backgroundPosition="bottom"
        height="20em"
      />

      <section style={introSectionStyle}>
        <h1 style={mainTitleStyle}>Serving Alabama Since 2013</h1>

        <div style={accentWrapStyle}>
          <div style={crimsonLineStyle}></div>
          <div style={darkLineStyle}></div>
        </div>

        <p style={introTextStyle}>
          The Alabama Productivity Center has partnered with organizations in counties across
          Alabama to provide consulting, internships, and workforce development opportunities.
        </p>

        <a href="#county-lookup" className="skip-link">
          Skip map, look up a county
        </a>

        <div style={mapCardStyle}>
          <iframe
            id="map"
            src="https://createaclickablemap.com/map.php?id=94591&maplocation=al&online=true"
            width="100%"
            height="650"
            style={iframeStyle}
            title="Interactive map of Alabama counties served by APC"
            aria-describedby="map-help"
          />

          <div style={legendStyle}>
            <span style={legendBoxStyle} aria-hidden="true"></span>
            <span style={legendTextStyle}>Counties Served</span>
          </div>
        </div>

        <div style={clickIconStyle} aria-hidden="true">⌖</div>

        <p id="map-help" style={mapHelpTextStyle}>
          Click a highlighted county on the map, or choose one below for the
          same details.
        </p>

        <div style={lookupCardStyle}>
          <label htmlFor="county-lookup" style={lookupLabelStyle}>
            Look up a county
          </label>
          <select
            id="county-lookup"
            value={countyName}
            onChange={(event) => setCountyName(event.target.value)}
            style={lookupSelectStyle}
            aria-describedby="map-help"
          >
            <option value="">Select a county</option>
            {SERVED_COUNTIES.map((row) => (
              <option key={row.county} value={row.county}>
                {row.county}
              </option>
            ))}
          </select>

          <div role="status" aria-live="polite">
            {selected ? (
              <div style={statsRowStyle}>
                <div style={statStyle}>
                  <div style={statValueStyle}>{formatCount(selected.companies)}</div>
                  <div style={statLabelStyle}>Companies served</div>
                </div>
                <div style={statStyle}>
                  <div style={statValueStyle}>{formatCount(selected.trained)}</div>
                  <div style={statLabelStyle}>Persons trained</div>
                </div>
                <div style={statStyle}>
                  <div style={statValueStyle}>{formatCount(selected.interns)}</div>
                  <div style={statLabelStyle}>Student interns</div>
                </div>
              </div>
            ) : (
              <p style={lookupHintStyle}>
                Choose a county to see companies served, people trained, and
                intern counts.
              </p>
            )}
          </div>
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={ctaTitleStyle}>Interested in bringing APC to your county?</h2>

        <div style={ctaAccentWrapStyle}>
          <div style={whiteLineStyle}></div>
          <div style={whiteLineStyle}></div>
        </div>

        <div style={buttonRowStyle}>
          <a href="/Home/Services" style={ctaButtonStyle}>
            Request Services
          </a>

          <a href="/Home/Internships" style={ctaButtonStyle}>
            Internship Program
          </a>
        </div>
      </section>
    </div>
  );
}

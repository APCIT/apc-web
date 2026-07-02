'use client';

import React, { useEffect } from 'react';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function LocationsPage() {
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

        <div style={mapCardStyle}>
          <iframe
            id="map"
            src="https://createaclickablemap.com/map.php?id=94591&maplocation=al&online=true"
            width="100%"
            height="650"
            style={iframeStyle}
            title="Alabama Counties Map"
          />

          <div style={legendStyle}>
            <span style={legendBoxStyle}></span>
            <span style={legendTextStyle}>Counties Served</span>
          </div>
        </div>

        <div style={clickIconStyle}>⌖</div>

        <p style={mapHelpTextStyle}>
          Click any highlighted county to view projects completed in that area.
        </p>
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

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

  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* Header Section */}
      <HeadingIntroBanner
        title="Locations"
        backgroundImage="/images/Headers/Locations.jpg"
        backgroundPosition="bottom"
        height="20em"
      />

      {/* Map Section */}
      <div className="w-full bg-white locations-section" style={{ padding: '2em' }}>
        <div className="w-full flex locations-container" style={{ position: 'relative' }}>
          {/* Map Container */}
          <div
            className="w-1/2 flex justify-center items-center locations-map"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <iframe
              id="map"
              src="https://createaclickablemap.com/map.php?id=94591&maplocation=al&online=true"
              width="100%"
              height="600"
              style={{
                border: 'none',
                width: '100%',
                height: '600px',
                transform: 'scale(1.15)',
                transformOrigin: 'center'
              }}
              title="Alabama Counties Map"
            />
          </div>

          {/* Information Box */}
          <div className="w-1/2 flex justify-center items-start locations-info" style={{ paddingTop: '2em' }}>
            <div
              className="boxshadowEffect-NoHover"
              style={{
                width: '98%',
                maxWidth: '700px',
                textAlign: 'center',
                borderRadius: '4px',
                backgroundColor: '#9E1B32',
                padding: '1.5em',
                boxSizing: 'border-box'
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1.5em',
                  fontWeight: 'normal',
                  marginBottom: '1em',
                  lineHeight: '1.4'
                }}
              >
                The Alabama Productivity Center has worked in a variety of areas across the state of Alabama. This map shows where we have worked since 2013.
              </h3>
              <h4
                style={{
                  color: 'white',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1.2em',
                  fontWeight: 'normal',
                  marginTop: '1em',
                  marginBottom: 0
                }}
              >
                Click on the county to see more details.
              </h4>
            </div>
          </div>

          {/* Counties Served Legend */}
          <div className="locations-legend" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            position: 'absolute',
            left: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10
          }}>
            <span style={{
              color: '#9E1B32',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '1.5em',
              fontWeight: 'bold'
            }}>
              Counties Served
            </span>
            <div style={{
              width: '14px',
              height: '14px',
              backgroundColor: '#9E1B32',
              display: 'inline-block'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

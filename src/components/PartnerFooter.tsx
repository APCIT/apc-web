import React from 'react';

const PartnerFooter: React.FC = () => {
  const partners = [
    {
      name: 'Alabama Workforce Training Center',
      logo: '/images/BottomBar/aidt.png',
      url: 'http://www.awtc.aidt.edu/'
    },
    {
      name: 'Manufacturing Extension Partnership',
      logo: '/images/BottomBar/mep.png',
      url: 'http://www.nist.gov/mep/'
    },
    {
      name: 'Alabama Industrial Development Training',
      logo: '/images/BottomBar/aidt-logoTrans.png',
      url: 'http://www.aidt.edu/'
    },
    {
      name: 'Alabama Aviation Training Center',
      logo: '/images/BottomBar/AviationTrans.png',
      url: 'http://www.aidt.edu/team/alabama-aviation-training-center-airbus/'
    },
    {
      name: 'Alabama Technology Network',
      logo: '/images/BottomBar/atn-logo3.png',
      url: 'http://www.atn.org/'
    },
    {
      name: 'University of Alabama',
      logo: '/images/BottomBar/ua.png',
      url: 'http://www.ua.edu'
    },
    {
      name: 'University of Alabama System',
      logo: '/images/BottomBar/UAS-AlignLogo-Stack-Black-RGB.png',
      url: 'https://uasystem.edu/'
    }
  ];

  return (
    <footer className="partner-footer">
      <br />
      <div className="partner-logos">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="partner-link"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="footer-icon"
            />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default PartnerFooter;


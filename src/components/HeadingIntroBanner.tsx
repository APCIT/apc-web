import React from 'react';

interface HeadingIntroBannerProps {
  title: string;
  backgroundImage: string;
  backgroundPosition?: 'center' | 'bottom' | 'top';
  height?: string;
}

export default function HeadingIntroBanner({
  title,
  backgroundImage,
  backgroundPosition = 'center',
  height = '15em'
}: HeadingIntroBannerProps) {
  return (
    <div 
      className="relative w-full bg-cover border-b-[0.75em] border-[#696969] pt-[1.5%] flex items-center justify-center"
      style={{
        height,
        backgroundImage: `url('${backgroundImage}')`,
        backgroundPosition: backgroundPosition === 'bottom' ? 'center bottom' : backgroundPosition === 'top' ? 'center top' : 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h1 
        className="hero-title-outline text-white text-center px-4"
        style={{
          fontSize: 'clamp(2.5em, 8vw, 6.5em)',
          lineHeight: '1.2',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: '400'
        }}
      >
        <strong>{title}</strong>
      </h1>
    </div>
  );
}


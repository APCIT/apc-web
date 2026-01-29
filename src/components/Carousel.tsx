'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Slide = {
  id: number;
  src?: string; // unused for stories (fixed bg), used for intro
  alt: string;
  opacity?: number;
  content?: {
    logos?: string[];
    body?: string;
    attribution?: string;
  };
};

const introSlides: Slide[] = [
  { id: 0, src: '/images/Backgrounds/Title_Slide_1.svg', alt: 'Contact Us', opacity: 0.6 },
  { id: 1, src: '/images/Backgrounds/Our_Mission_Slide.svg', alt: 'Lean Manufacturing Class' },
  { id: 2, src: '/images/Backgrounds/Internships_Slide_3.svg', alt: 'Fall Impacts' },
  { id: 3, src: '/images/Backgrounds/Professional_Services_Slide_4.svg', alt: 'Intern Spotlight' },
  { id: 4, src: '/images/Backgrounds/In-State_Hire_Rate_Slide_5.svg', alt: 'Mission Statement' },
];

const storiesSlides: Slide[] = [
  {
    id: 0,
    alt: 'Toyota Alabama testimonial',
    content: {
      logos: ['/images/Logos/toyotaalabamalogo.png'],
      body: `"As a summer intern at Toyota Motor Manufacturing Alabama with the Alabama Productivity Center, I was able to gain a better understanding of the career field that I was preparing for. I learned valuable lessons, which can only be obtained through working in the field. Many students do not get an opportunity like this, and I will always be grateful for my experience there. Because of this internship, I am now working with Mazda-Toyota Manufacturing, U.S.A. Inc."`,
      attribution: '- Hayden D. Bevil, PC, PPM Specialist',
    },
  },
  {
    id: 1,
    alt: 'SMP and IAC case study',
    content: {
      logos: ['/images/Logos/SMP.png', '/images/Logos/IAC.png'],
      body: `"Through SolidWorks, the interns designed handles and magnetic tooltips for production as well as mill stops for the tool shop. The financial impacts for the internship included avoided safety costs of at least $60,000 and a reduced of overtime totaling $57,242. The total costs savings at SMP were $117,242."`,
    },
  },
  {
    id: 2,
    alt: 'Precision company testimonial',
    content: {
      logos: ['/images/Logos/precision.png'],
      body: `"The University of Alabama ATN Center is a great resource for our business. They are quick to respond and provide the highest level of service. Their internship program has provided great young talent that are able to take on important projects needed to sustain our business. This is a great program for the manufacturing industry in our state."`,
      attribution: '- Chase Fell, VP of Engineering',
    },
  },
];

export default function Carousel({ variant = 'intro' }: { variant?: 'intro' | 'stories' }) {
  const baseSlides = variant === 'intro' ? introSlides : storiesSlides;
  const slides = [baseSlides[baseSlides.length - 1], ...baseSlides, baseSlides[0]];
  const [index, setIndex] = useState(1);
  const [isAuto, setIsAuto] = useState(true);
  const [transition, setTransition] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuto) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => next(), 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAuto, index]);

  const next = () => {
    setIndex((i) => {
      const newIndex = i + 1;
      if (newIndex >= slides.length - 1) return slides.length - 1;
      return newIndex;
    });
  };

  const prev = () => {
    setIndex((i) => {
      const newIndex = i - 1;
      if (newIndex <= 0) return 0;
      return newIndex;
    });
  };

  const onTransitionEnd = () => {
    if (index === slides.length - 1) {
      setTransition(false);
      setIndex(1);
      requestAnimationFrame(() => requestAnimationFrame(() => setTransition(true)));
    }
    if (index === 0) {
      setTransition(false);
      setIndex(slides.length - 2);
      requestAnimationFrame(() => requestAnimationFrame(() => setTransition(true)));
    }
  };

  const goToReal = (realIdx: number) => setIndex(realIdx + 1);
  const real = (index - 1 + baseSlides.length) % baseSlides.length;

  return (
    <div
      className={`carousel-container relative w-full overflow-hidden isolate ${variant === 'intro' ? 'carousel-intro bg-black' : 'carousel-stories'}`}
      style={{ height: variant === 'intro' ? 600 : 400, backgroundColor: variant === 'intro' ? '#000000' : 'transparent' }}
      onMouseEnter={() => setIsAuto(false)}
      onMouseLeave={() => setIsAuto(true)}
    >
      {/* FIXED BACKGROUND (stories): factory3 across entire carousel */}
      {variant === 'stories' && (
        <>
          <div className="absolute inset-0 bg-black" />
          <Image
            src="/images/factory3.jpg"
            alt="Factory background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
        </>
      )}

      {/* Sliding track */}
      <div
        className={`flex h-full z-10 ${transition ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={onTransitionEnd}
      >
        {slides.map((s, idx) => (
          <div key={`${s.id}-${idx}`} className="relative min-w-full h-full flex-shrink-0">
            {/* INTRO: present slide asset on black */}
            {variant === 'intro' && (
              <>
                <div className="carousel-slide-bg absolute inset-0 bg-black" />
                {s.src && (
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="100vw"
                    priority={idx === 1}
                    className="carousel-slide-image object-contain"
                    style={{ opacity: s.opacity ?? 1 }}
                  />
                )}
              </>
            )}

            {/* STORIES: only swap CONTENT (logo left, text right). No white bubble. */}
            {variant === 'stories' && (
              <div className="stories-content absolute inset-0 z-10 flex items-center justify-center h-full px-[164px]">
                <div className="stories-inner flex w-full h-full items-center">
                  {/* Left: Logos */}
                  <div className="stories-logos w-1/2 h-full flex flex-col gap-6 justify-center items-center">
                    {(s.content?.logos ?? []).map((logoSrc, i) => (
                      <div key={i} className="w-full flex justify-center">
                        <div className="stories-logo-container relative" style={{ width: '80%', height: '120px' }}>
                          <Image 
                            src={logoSrc} 
                            alt={`logo ${i + 1}`} 
                            fill 
                            className="object-contain" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Right: Text */}
                  <div className="stories-text w-1/2 h-full flex items-center">
                    <div className="stories-text-inner" style={{ paddingRight: '25%' }}>
                      {s.content?.body && (
                        <p className="stories-body" style={{ color: 'black', fontSize: '1.5em', fontWeight: 400 }}>
                          {s.content.body}
                        </p>
                      )}
                      {s.content?.attribution && (
                        <>
                          <br />
                          <span className="stories-attribution" style={{ float: 'right', fontSize: '1.5em', fontWeight: 400, color: 'black' }}>{s.content.attribution}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nav buttons (white over dark) */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="carousel-prev-btn absolute left-0 top-0 h-full w-16 flex items-center justify-center text-white z-50"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          left: '100px',
          top: '0',
          height: '100%',
          width: '64px',
          zIndex: 9999,
          color: 'white',
          cursor: 'pointer',
        }}
      >
        <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="carousel-next-btn absolute right-0 top-0 h-full w-16 flex items-center justify-center text-white z-50"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          right: '100px',
          top: '0',
          height: '100%',
          width: '64px',
          zIndex: 9999,
          color: 'white',
          cursor: 'pointer',
        }}
      >
        <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Indicators — black theme */}
      <div
        className="carousel-indicators"
        style={{
          position: 'absolute',
          bottom: variant === 'intro' ? '50px' : '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 9999,
        }}
      >
        {baseSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToReal(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: i === real ? '#000000' : 'transparent',
              border: '1px solid #000000',
              borderRadius: '50%',
              cursor: 'pointer',
              padding: 0,
              margin: 0,
              display: 'block',
            }}
          />
        ))}
      </div>
    </div>
  );
}

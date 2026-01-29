'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  imageStyles: { marginLeft: string; marginTop: string };
  link: string;
  buttonText: string;
}

export default function ServiceCards() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const cardsData: CardData[] = [
    {
      id: 1,
      title: 'Client Services',
      description:
        'View the services we provide for our clients such as internships',
      image: '/images/HomepageButtons/servicesCard.jpg',
      imageStyles: { marginLeft: '-8px', marginTop: '-30px' },
      link: '/Home/Services',
      buttonText: 'Learn More',
    },
    {
      id: 2,
      title: 'Internships',
      description:
        'View information about student internships and finding interns',
      image: '/images/HomepageButtons/internshipsCard.jpg',
      imageStyles: { marginLeft: '-5px', marginTop: '-30px' },
      link: '/Home/Internships',
      buttonText: 'Learn More',
    },
    {
      id: 3,
      title: 'Locations',
      description:
        'View the locations of all our business partners and see where you could go',
      image: '/images/Icons/alabamastateicon.jpg',
      imageStyles: { marginLeft: '-5px', marginTop: '-5px' },
      link: '/Home/Locations',
      buttonText: 'View Locations',
    },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setIsVisible(true)),
      { threshold: 0.1, rootMargin: '-10% 0px' }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) obs.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <>
    <div className="w-full block shrink-0" style={{ height: '64px' }} aria-hidden />
    <section role="region" aria-label="Service Cards">

      <div ref={sectionRef} className="mx-auto px-[10%] pb-[32px]">
        <div className="py-6" />

        {/* grid layout */}
        <div className="service-cards-grid grid grid-cols-3 gap-[30px] items-stretch px-[30px]">
          {cardsData.map((card, index) => (
            <div
              key={card.id}
              className={`transition-all duration-500 ease-in-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div
                className="group h-full w-full flex flex-col 
                           bg-[#EEEEEE] rounded-md
                           border-[3px] border-[rgba(0,0,0,0.1)]
                           shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                           transition-all duration-500 ease-in-out
                           hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)] hover:border-[rgba(0,0,0,0.5)]
                           px-4 pt-[25px] pb-[12px] gap-8"
              >
                {/* IMAGE */}
                <div className="flex justify-center mb-4">
                  <Link href={card.link}>
                    <div
                      className="relative size-[200px] rounded-full overflow-hidden
                                 border-[3px] border-[rgba(0,0,0,0.1)]
                                 shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                                 transition-all duration-500 ease-in-out
                                 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)] group-hover:border-[rgba(0,0,0,0.5)]
                                 hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)] hover:border-[rgba(0,0,0,0.5)]"
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-[105%] h-auto"
                        style={{
                          marginLeft: card.imageStyles.marginLeft,
                          marginTop: card.imageStyles.marginTop,
                        }}
                      />
                    </div>
                  </Link>
                </div>

                {/* TEXT */}
                <div className="text-center px-2">
                  <h2 className="text-2xl font-semibold mb-1 text-[#1a1a1a]">
                    {card.title}
                  </h2>
                  <p className="text-[#6b6b6b] text-[15px] leading-snug max-w-[400px] mx-auto">
                    {card.description}
                  </p>
                </div>
                <div className="mt-10 flex justify-center">
                  <Link
                    href={card.link}
                    style={{ color: 'white', textDecoration: 'none' }}
                    className="
                      w-[80%]
                      bg-[#9E1B32]
                      font-roboto
                      !text-white visited:!text-white hover:!text-white focus:!text-white active:!text-white text-[17px]
                      py-[10px]
                      rounded-full
                      border-[3px] border-[rgba(0,0,0,0.1)]
                      shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                      text-center leading-normal cursor-pointer no-underline hover:no-underline focus:no-underline visited:no-underline hover:decoration-transparent focus:decoration-transparent active:decoration-transparent
                      transition-all duration-500 ease-in-out
                      hover:text-[20px]
                      hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
                      hover:border-[rgba(0,0,0,0.5)]
                    "
                  >
                    {card.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
        <div className="w-full block shrink-0" style={{ height: '64px' }} aria-hidden />
         <div className="success-stories-btn-container mt-6 flex justify-center">
          <Link
            href="/Home/SuccessStories"
            style={{ color: 'white', textDecoration: 'none' }}
            className="success-stories-btn
              w-[60%] sm:w-[55%] md:w-[50%] lg:w-[45%]
              bg-[#9E1B32]
              font-roboto
              !text-white visited:!text-white hover:!text-white focus:!text-white active:!text-white text-[18px]
              py-[12px]
              rounded-full
              border-[3px] border-[rgba(0,0,0,0.1)]
              shadow-[0_3px_10px_rgba(0,0,0,0.5)]
              text-center leading-normal cursor-pointer no-underline hover:no-underline focus:no-underline visited:no-underline hover:decoration-transparent focus:decoration-transparent active:decoration-transparent
              transition-all duration-500 ease-in-out
              hover:text-[20px]
              hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
              hover:border-[rgba(0,0,0,0.5)]
            "
          >
            Click here to read our Success Stories
          </Link>
        </div>
    </>
  );
}

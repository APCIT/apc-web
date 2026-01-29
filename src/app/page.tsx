'use client';

import Carousel from '@/components/Carousel';
import StatisticsCounter from '@/components/StatisticsCounter';
import ServiceCards from '@/components/ServiceCards';
import Footer from '@/components/Footer';

const statsData = [
  { 
    value: '149', 
    label: 'Companies Served', 
    icon: '/images/Icons/CompaniesImpacted.png' 
  },
  { 
    value: '793', 
    label: 'Student Interns', 
    icon: '/images/Icons/InternsIcon.png' 
  },
  { 
    value: '991', 
    label: 'Number of Projects', 
    icon: '/images/Icons/EndeavoursIcon.png' 
  },
  { 
    value: '$ 60.6M', 
    label: 'Reported Impacts ($)', 
    icon: '/images/Icons/ReportedIcon.png' 
  }
];

export default function Home() {
  return (
    <div>
      <Carousel variant="intro" />
      <StatisticsCounter stats={statsData} />
      <div
        className="w-full bg-[#3d3d3d] block shrink-0"
        style={{ height: '64px' }}
        aria-hidden
      />

      <section className="about-section bg-[#3d3d3d] py-8">
        <div className="container mx-auto px-4">
          <div className="about-row flex -mx-4">
            <div className="about-image-col w-1/2 px-4">
              <div className="w-auto flex items-center justify-center">
                <img
                  src="/images/Staff2023.jpg"
                  alt="Staff Photo 2023"
                  className="about-image w-4/5 h-auto mx-auto block shadow-[0_3px_10px_rgba(0,0,0,0.7)]"
                />
              </div>
            </div>

            <div className="about-text-col w-1/2 px-4 pr-[75px]">
              <h1 className="my-[0.67em] text-[2em] font-bold font-roboto text-white text-center">
                ABOUT US
              </h1>

              <hr className="w-3/5 mx-auto border-0 border-t border-gray-400" />

              <p className="text-center text-white text-[18pt] pl-[15px] pr-[15px] leading-relaxed font-roboto font-normal">
              The Alabama Productivity Center, a non-profit organization, is an outcome
                of a 1983 joint venture of the University of Alabama and General Motors to
                save a Tuscaloosa GM plant from closing. The positive experience utilizing
                university faculty and students to save Alabama jobs led to the establishment
                and sponsorship by Alabama Power Company and the University of Alabama.
              </p>

              <div className="about-btn-row flex w-full mt-4">
                <div className="about-btn-spacer w-1/3" />
                <div className="about-btn-container w-1/3 px-2 flex justify-center">
                  <button
                    onClick={() => (window.location.href = '/Home/About')}
                    className="about-btn
                      w-[75%]
                      bg-[#9E1B32]
                      !text-white
                      font-roboto
                      text-[20px]
                      px-[20px]
                      py-[10px]
                      my-1 mx-[2px]
                      rounded-[500px]
                      border-[3px]
                      border-[rgba(0,0,0,0.1)]
                      shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                      block
                      mx-auto
                      text-center
                      leading-normal
                      cursor-pointer
                      transition-all
                      duration-500
                      ease-in-out
                      hover:text-[24px]
                      hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
                      hover:border-[rgba(0,0,0,0.5)]
                    "
                  >
                    Learn More
                  </button>
                </div>
                <div className="about-btn-spacer w-1/3" />
              </div>

              <div className="about-annual w-full mt-5 text-center mt-[20px]">
                <a
                  href="https://apcstorage.blob.core.windows.net/staff-only-materials/FY23-Annual-Report-FINAL.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-annual-link flex justify-center items-center no-underline text-white !text-white visited:!text-white hover:!text-white focus:!text-white active:!text-white hover:decoration-transparent"
                  style={{ color: 'white' }}
                >
                  <img
                    src="/images/Icons/Annual_Icon.png"
                    alt="Annual Report"
                    className="about-annual-icon w-[150px] h-[150px] mr-2.5"
                  />
                  <span className="mt-2.5 text-[20px] text-white">Click to view our annual report</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="w-full bg-[#3d3d3d] block shrink-0"
        style={{ height: '64px' }}
        aria-hidden
      />
      <ServiceCards />
      <div
        className="w-full bg-white block shrink-0"
        style={{ height: '64px' }}
        aria-hidden
      />
      <div
        className="w-full bg-white block shrink-0"
        style={{ height: '64px' }}
        aria-hidden
      />
      <Carousel variant="stories" />
      <div
        className="w-full bg-white block shrink-0"
        style={{ height: '64px' }}
        aria-hidden
      />
      <div
        className="w-full bg-white block shrink-0"
        style={{ height: '64px' }}
        aria-hidden
      />
      <Footer />
    </div>
  );
}
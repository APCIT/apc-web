import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Jan Ingenrieth',
};

const BIO_PARAGRAPHS = [
  'Jan Brazeal Ingenrieth is a Business Services Specialist for The Alabama Productivity Center, a part of The University of Alabama. She received both her B.A. in Communication and M.A. in Community Counseling from The University of Alabama.',
  'She began her professional career in staffing in 1999 managing industrial accounts then becoming Operations Manager in 2001. During her career in staffing, she supervised up to 350 temporary employees and managed assignments for more than 50 clients with sales of $1M. She became a Field Representative as well in 2001 and trained new franchise owners on operations and inside sales. In 2002 she left staffing and joined the Automotive Industry as a Human Resource and Safety Manager of a start-up operation. Jan worked in the Automotive Industry as a Human Resource & Safety Manager with increasingly responsible roles for Tier I automotive manufacturers supplying Mercedes, Volkswagen and BMW from 2002 to 2013. Throughout her tenure as Human Resource Manager, she was responsible for recruiting and hiring for all levels, organizational development and training and standardization of procedures, policies and documentation.',
  'Jan joined The Alabama Productivity Center in 2014 and currently provides training and development for businesses throughout Alabama. She also recruits, interviews and places students into internship programs state-wide which are assigned to special projects assisting with overall company goals. Jan is a Certified Leadership Trainer and Coach through the John C. Maxwell Leadership program. Jan is a member of the Church of the Highlands and enjoys travel, photography and arts and crafts. When she\'s not busy at work, she\'s busy being creative.',
];

export default function JanIngenriethProfilePage() {
  return (
    <div className="w-full bg-white text-black">
      <section
        className="mx-auto w-full max-w-[1550px] px-1 md:px-2"
        style={{ paddingTop: '48px', paddingBottom: '64px' }}
      >
        <div className="grid grid-cols-[340px_minmax(0,1fr)] items-start gap-20">
          <aside className="w-full max-w-[280px] justify-self-start text-center">
            <div className="relative mx-auto h-[230px] w-[230px] overflow-hidden rounded-[4px] border border-black/10 shadow-[0_3px_10px_rgba(0,0,0,0.5)]">
              <Image
                src="/images/StaffProfilePics/JanUpdated.JPG"
                alt="Jan Ingenrieth"
                fill
                className="object-cover"
                sizes="230px"
                priority
              />
            </div>

            <h1 className="mt-4 text-[28px] leading-tight text-[#900] [font-family:Roboto,sans-serif]">
              Jan Ingenrieth
            </h1>
            <hr className="mx-auto mt-3 w-[70%] border-t border-black/25" />

            <p className="mt-6 text-[17px] leading-tight text-[#333] [font-family:Roboto,sans-serif]">
              Business Services Specialist
            </p>

            <a
              href="mailto:jan.ingenrieth@ua.edu"
              className="mt-6 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              jan.ingenrieth@ua.edu
            </a>
            <a
              href="tel:2052426057"
              className="mt-2 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              (205) 242-6057
            </a>
          </aside>

          <article className="ml-3 space-y-6 pl-10 pt-1 text-[18px] leading-[1.45] text-[#222] [font-family:Roboto,sans-serif]">
            {BIO_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}

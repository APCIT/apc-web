import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Morgan Harrison',
};

const BIO_PARAGRAPHS = [
  'Morgan Harrison is a Productivity Engineer for The Alabama Productivity Center, a part of the Culverhouse College of Business at The University of Alabama. Morgan is a 2006 graduate of The University of Alabama with a Bachelor of Science in Industrial Engineering. During her time at The University of Alabama, she participated in the Co-op Program, working three semesters with Whitesell Group in North Alabama.',
  'After graduation, Morgan worked for Michelin as an Industrial Engineer in one of their tire manufacturing facilities. Following her time with Michelin, she started a career in telecommunications, working almost 12 years for AT&T Contractor company, Summit Engineering Services. She served as the Manager of Database Operations where she oversaw a team of Data Specialists. Her work also included project management, reviewing and approving invoices, training employees in the use of various databases, and maintaining access control for many AT&T databases. While at Summit Engineering Services, she took on the additional role of Quality Control Specialist, conducting quality reviews of Outside Plant Engineering jobs. Her work also included designing and drafting fiber telecommunication jobs.',
  'Morgan has served on the Society of Women Engineers Advisory Board at The University of Alabama since 2015. She is also active with the Junior League of Tuscaloosa, volunteering at Holt Elementary and with Junior Achievement. Morgan joined APC in 2019 bringing her skills in engineering and database management to this position.',
];

export default function MorganHarrisonProfilePage() {
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
                src="/images/StaffProfilePics/MorganHeadshot.jpg"
                alt="Morgan Harrison"
                fill
                className="object-cover"
                sizes="230px"
                priority
              />
            </div>

            <h1 className="mt-4 text-[28px] leading-tight text-[#900] [font-family:Roboto,sans-serif]">
              Morgan Harrison
            </h1>
            <hr className="mx-auto mt-3 w-[70%] border-t border-black/25" />

            <p className="mt-6 text-[17px] leading-tight text-[#333] [font-family:Roboto,sans-serif]">
              Productivity Engineer
            </p>

            <a
              href="mailto:morgan.harrison@ua.edu"
              className="mt-6 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              morgan.harrison@ua.edu
            </a>
            <a
              href="tel:2053487968"
              className="mt-2 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              (205) 348-7968
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

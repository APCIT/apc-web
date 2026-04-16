import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Justin Rodgers',
};

const BIO_PARAGRAPHS = [
  'Justin Rodgers is a Productivity Engineer I for the Alabama Productivity Center, a part of the University of Alabama, in the Mobile area. He graduated from the school of College of Human Environmental Sciences with a B.S. in Hospitality Management in 2016 and is currently working on his MBA.',
  'He began as a business administration student intern for Evonik Industries in 2015 and 2016, a multinational specialty chemical manufacture serving the automotive, plastics, pharmaceutical and other industries in Mobile, AL. Also in 2015 and 2016, Justin was an intern for the Tuscaloosa County Industrial County Authority completing a county-wide hourly wage survey for Tuscaloosa County in the manufacture industry and doing market research for the county as well. He also served as an intern for the Alabama Productivity Center in 2016 where he worked on multiple projects and researched marketing materials for the center.',
  'Justin joined the Alabama Productivity Center in 2017 with the vision of expanding the center\'s services and internship programs in the greater Mobile, AL area. Located at the GulfQuest Maritime Museum in Mobile, AL, Justin is the first APC alum to join the staff and has worked on various projects in Health & Safety, process improvement and problem solving through the APC since 2017. A personal goal of Justin\'s is to be able to retain recent college graduates from the State of Alabama to stay in Alabama\'s workforce after graduation.',
];

export default function JustinRodgersProfilePage() {
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
                src="/images/StaffProfilePics/Justin_Rodgers_Headshot.jpg"
                alt="Justin Rodgers"
                fill
                className="object-cover"
                sizes="230px"
                priority
              />
            </div>

            <h1 className="mt-4 text-[28px] leading-tight text-[#900] [font-family:Roboto,sans-serif]">
              Justin Rodgers
            </h1>
            <hr className="mx-auto mt-3 w-[70%] border-t border-black/25" />

            <p className="mt-6 text-[17px] leading-tight text-[#333] [font-family:Roboto,sans-serif]">
              Productivity Engineer
            </p>

            <a
              href="mailto:justin.rodgers@ua.edu"
              className="mt-6 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              justin.rodgers@ua.edu
            </a>
            <a
              href="tel:2512341724"
              className="mt-2 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              (251) 234-1724
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

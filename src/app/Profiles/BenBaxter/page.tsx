import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ben Baxter',
};

const BIO_PARAGRAPHS = [
  'Ben Baxter is a Productivity Engineer for the Alabama Productivity Center, a part of the Culverhouse College of Business at The University of Alabama. Ben is a 2010 graduate of The University of Alabama with a Bachelor of Science in Industrial Engineering. Ben would later continue his education by earning a Master of Business Administration in 2016 from Troy University. During his time as a UA undergraduate, Ben was a three-time intern with Southern Nuclear at Farley Nuclear Plant in southeast Alabama.',
  'Upon graduation from UA, Ben accepted an offer to return to Southern Nuclear as a Program Engineer who primarily managed the on-going effects of flow-accelerated corrosion on steam and water piping systems. Following his time in the nuclear industry, Ben would move back to Tuscaloosa and spend over five years as a Quality Engineer in the automotive supplier world. In this role, he would serve southern automaker customers such as Volkswagen Chattanooga Assembly Plant, Mercedes-Benz U.S. International, and Honda Manufacturing of Alabama. With the experience Ben gained in automotive, he would transition into quality assurance leadership with two certified ISO 9001 companies—HarbisonWalker International and Avient Corporation.',
  'Ben joined APC in 2023 bringing his skills in quality assurance, continuous improvement, and proactive safety to this position. He is also an active community member, being an active participant in Leadership Tuscaloosa Alumni Association and Tuscaloosa County UA Alumni Chapter. Lastly, Ben is an elder and member at Hope City Church Tuscaloosa, and he enjoys traveling the fifty states with his wife, Alyson, and their two daughters.',
];

export default function BenBaxterProfilePage() {
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
                src="/images/StaffProfilePics/Ben Baxter.jpg"
                alt="Ben Baxter"
                fill
                className="object-cover"
                sizes="230px"
                priority
              />
            </div>

            <h1 className="mt-4 text-[28px] leading-tight text-[#900] [font-family:Roboto,sans-serif]">
              Ben Baxter
            </h1>
            <hr className="mx-auto mt-3 w-[70%] border-t border-black/25" />

            <p className="mt-6 text-[17px] leading-tight text-[#333] [font-family:Roboto,sans-serif]">
              Productivity Engineer
            </p>

            <a
              href="mailto:ben.baxter@ua.edu"
              className="mt-6 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              ben.baxter@ua.edu
            </a>
            <a
              href="tel:2053487957"
              className="mt-2 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              (205) 348-7957
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

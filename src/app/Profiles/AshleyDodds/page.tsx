import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ashley Dodds',
};

const BIO_PARAGRAPHS = [
  'Ashley Dodds has proudly been part of The University of Alabama community since 2007 and has served in Culverhouse since 2020. In 2019, she earned her Bachelor of Arts in Communication & Information Sciences majoring in Public Relations, an accomplishment that was especially meaningful to her as a full-time UA employee, mother and wife. That experience helped to strengthen her commitment to lifelong growth both personally and professionally.',
  'Ashley was born and raised in Tuscaloosa and has been proud to call it home her entire life. She is blessed with a wonderful husband, three grown sons, one grandson, and three dogs who keep life fun and busy. In her free time, she enjoys shopping, being outdoors, and getting lost in a good book.',
];

export default function AshleyDoddsProfilePage() {
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
                src="/images/StaffProfilePics/AshleyDoddsHeadshot.jpg"
                alt="Ashley Dodds"
                fill
                className="object-cover object-[center_35%]"
                sizes="230px"
                priority
              />
            </div>

            <h1 className="mt-4 text-[28px] leading-tight text-[#900] [font-family:Roboto,sans-serif]">
              Ashley Dodds
            </h1>
            <hr className="mx-auto mt-3 w-[70%] border-t border-black/25" />

            <p className="mt-6 text-[17px] leading-tight text-[#333] [font-family:Roboto,sans-serif]">
              Operations Manager
            </p>

            <a
              href="mailto:hacoker@ua.edu"
              className="mt-6 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              hacoker@ua.edu
            </a>
            <a
              href="tel:2053488953"
              className="mt-2 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              (205)348-8953
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

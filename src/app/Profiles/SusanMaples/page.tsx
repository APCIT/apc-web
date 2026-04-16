import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Susan Maples',
};

const BIO_PARAGRAPHS = [
  'Susan Maples is a Productivity Engineer for the Alabama Productivity Center, a part of the Culverhouse College of Business at the University of Alabama. Susan graduated from the University of Kentucky College of Engineering with a B.S. in Electrical Engineering.',
  'She began her professional career with Toyota Motor Manufacturing in Georgetown, Kentucky. During her time at Toyota, she worked in the Paint Shop as a Process Engineer and New Model Engineer establishing in-process quality systems, introducing new materials/equipment, and developing countermeasures for pre-production and production issues. She also held management positions in Production and Production Engineering, focusing on standardization and cost reduction. She was trained under a Japanese sensei and acquired a strong foundation in the Toyota Production System. Susan also worked at Michelin Tire (BFGoodrich division) in Tuscaloosa in the roles of Industrial Engineer and Business Unit Leader, leading continuous improvement activities and coaching and developing operators. After Michelin, she was an Industrial Engineer with Industrial Automotive Components focusing on plant flow and layout improvements.',
  'Susan received her Green Belt Certification during her time at Michelin. She is a member of the Society of Women Engineers and the Society of Manufacturing Engineers. Susan joined the Alabama Productivity Center in 2023 bringing her lean manufacturing experience to this position. She enjoys spending her spare time traveling and with her husband and four children.',
];

export default function SusanMaplesProfilePage() {
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
                src="/images/StaffProfilePics/SusanMaples.jpg"
                alt="Susan Maples"
                fill
                className="object-cover"
                sizes="230px"
                priority
              />
            </div>

            <h1 className="mt-4 text-[28px] leading-tight text-[#900] [font-family:Roboto,sans-serif]">
              Susan Maples
            </h1>
            <hr className="mx-auto mt-3 w-[70%] border-t border-black/25" />

            <p className="mt-6 text-[17px] leading-tight text-[#333] [font-family:Roboto,sans-serif]">
              Productivity Engineer
            </p>

            <a
              href="mailto:susan.maples@ua.edu"
              className="mt-6 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              susan.maples@ua.edu
            </a>
            <a
              href="tel:2052925848"
              className="mt-2 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              (205) 292 5848
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

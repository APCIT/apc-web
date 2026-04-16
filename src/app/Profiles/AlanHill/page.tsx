import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Alan Hill',
};

const BIO_PARAGRAPHS = [
  'Alan Hill is the Executive Director for The Alabama Productivity Center, a part of the Culverhouse College of Business and The University of Alabama. Alan earned a Bachelor of Science in Mechanical Engineering and a Masters of Engineering Degree from The University of Alabama at Birmingham.',
  'Upon completing his bachelor\'s degree in 1988 he accepted a Project Engineering position with Boeing Aerospace and Engineering in Huntsville, Alabama working on the Space Station program. Then in 1991 Alan joined Zurn Air Systems Division in Birmingham, Alabama as a Project and Technical Sales Engineer in their Custom Industrial Fan Department. During this time he worked extensively with many manufacturing organizations throughout the United States and abroad. After seven years with Zurn he joined the Alabama Technology Network (ATN). During his 14 years with this organization he served as Project Engineer, Program Manager and Center Director providing innovative and sustainable solutions to Alabama business and industry. This experienced prepared him for his current position as Executive Director of The University of Alabama\'s Alabama Productivity Center.',
  'He has worked on many productivity improvement projects with a variety of industries including healthcare, automotive, aerospace, metal, and chemical. He is a Lean-Six Sigma Black Belt and holds certifications in a variety of quality management systems, environmental management systems, health and safety management systems, and lean manufacturing. In addition to supporting the state\'s economic development initiatives and leading a team of highly talented staff, Alan uses his years of industry experience to support University student internships that provide valuable experiential learning opportunities to the next generation of industry leaders. In his spare time, Alan likes to restore cars with his son.',
];

export default function AlanHillProfilePage() {
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
                src="/images/StaffProfilePics/A. Hill Picture.jpg"
                alt="Alan Hill"
                fill
                className="object-cover"
                sizes="230px"
                priority
              />
            </div>

            <h1 className="mt-4 text-[28px] leading-tight text-[#900] [font-family:Roboto,sans-serif]">
              Alan Hill
            </h1>
            <p className="mt-1 text-[13px] italic text-[#555] [font-family:Sanchez,serif]">MEng, CQA, CEA</p>
            <hr className="mx-auto mt-3 w-[70%] border-t border-black/25" />

            <p className="mt-6 text-[17px] leading-tight text-[#333] [font-family:Roboto,sans-serif]">
              Executive Director
            </p>

            <a
              href="mailto:alan.hill@ua.edu"
              className="mt-6 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              alan.hill@ua.edu
            </a>
            <a
              href="tel:2052227111"
              className="mt-2 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              (205) 222-7111
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

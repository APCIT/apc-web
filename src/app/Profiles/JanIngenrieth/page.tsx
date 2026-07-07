import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Jan Ingenrieth',
};

const BIO_PARAGRAPHS = [
  'Jan Brazeal Ingenrieth is the APC Internship Program Director. She joined the Alabama Productivity Center (APC), in 2014. In this capacity, she leads the center’s internship program, collaborating with companies across Alabama to develop meaningful project-based opportunities. Jan recruits, interviews, and places students from colleges and universities into high-value internships, while also mentoring and coaching them throughout the internships. She finds great fulfillment in supporting young professionals as they grow and excel in their careers.',
  'Before joining APC, Jan built a strong foundation in the staffing industry as an Operations Manager and Field Representative, where she successfully managed assignments for more than 50 clients and generated over $1 million in sales. She later transitioned into the automotive industry, beginning as a Human Resources Manager for a startup venture before advancing into senior HR and Safety leadership roles with Tier I suppliers to global brands including Mercedes, Volkswagen, and BMW.',
  'Jan is a Certified Leadership Trainer and Coach through the John C. Maxwell Leadership Program and holds the designation of SHRM Senior Certified Professional. She also serves on the board of the Southern Automotive Women’s Forum. A proud graduate of The University of Alabama, Jan earned both her bachelor’s and master’s degrees there.',
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

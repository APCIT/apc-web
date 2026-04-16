import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Tara Johnson',
};

const BIO_PARAGRAPHS = [
  'Tara Johnson is the Business Manager at The Alabama Productivity Center. She holds a Bachelor of Business Administration from The University of West Alabama and was actively involved in various organizations during her time there, including S.I.F.E., ODK, and Phi Mu Fraternity.',
  'Tara\'s professional journey began at Chuck\'s Fish Restaurant in Tuscaloosa, where she initially worked as a server. Within a year, she demonstrated exceptional leadership skills and was promoted to the role of Event Coordinator/Front of House Manager. Over the next four years, she continued to excel and eventually assumed the position of General Manager. She then joined McGiffert and Associates, LLC as an Administrative Assistant, where she managed all aspects of contract administration, including proposal reviews, data mining, employee training, typesetting, and budget management.',
  'In March 2021, Tara joined the Alabama Productivity Center as the Contracts and Grants Specialist/Business Manager. In addition to her professional responsibilities, she actively serves the community as the Secretary of the Tuscaloosa Area Phi Mu Alumnae Chapter and is a Founding Member of Young Tuscaloosa.',
  'Tara is deeply committed to her work and enjoys spending her leisure time outdoors or in the pool with her husband and son.',
];

export default function TaraJohnsonProfilePage() {
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
                src="/images/StaffProfilePics/TaraJohnson.jpg"
                alt="Tara Johnson"
                fill
                className="object-cover"
                sizes="230px"
                priority
              />
            </div>

            <h1 className="mt-4 text-[28px] leading-tight text-[#900] [font-family:Roboto,sans-serif]">
              Tara Johnson
            </h1>
            <hr className="mx-auto mt-3 w-[70%] border-t border-black/25" />

            <p className="mt-6 text-[17px] leading-tight text-[#333] [font-family:Roboto,sans-serif]">
              Business Manager
            </p>

            <a
              href="mailto:tara.johnson@ua.edu"
              className="mt-6 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              tara.johnson@ua.edu
            </a>
            <a
              href="tel:2053488953"
              className="mt-2 block text-[15px] text-[#555] hover:underline [font-family:Roboto,sans-serif]"
            >
              (205) 348-8953
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

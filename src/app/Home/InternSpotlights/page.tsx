import Image from "next/image";
import HeadingIntroBanner from "@/components/HeadingIntroBanner";

type InternSpotlight = {
  name: string;
  education: string;
  company: string;
  image: string;
  imagePosition?: string;
  description: string;
};

const internSpotlights: InternSpotlight[] = [
  {
    name: "Emma Hostettler",
    education:
      "Senior, Advertising and Public Relations with a minor in Communication Studies — University of South Alabama",
    company: "Mazda Toyota Manufacturing",
    image: "/images/InternHeadshots/8122058136.jpg",
    description:
      "In her free time, Emma enjoys spending time with friends and family. During her internship at Mazda Toyota Manufacturing, she hopes to gain a better understanding of social media management and how to support a company’s public reputation through various forms of content creation.",
  },
  {
    name: "Samuel Campbell",
    education:
      "Fifth-Year Ph.D. Student — The University of Alabama",
    company: "S.T. Bunn",
    image: "/images/InternHeadshots/2283827821.jpg",
    imagePosition: "center 45%",
    description:
      "Originally from Mississippi, Samuel enjoys swimming, reading, and spending time with his fiancé. Through his internship at S.T. Bunn, he hopes to gain real-world experience developing artificial intelligence tools for industry applications.",
  },
  {
    name: "Kyler Mitchell",
    education:
      "Senior, Mechanical Engineering — The University of Alabama in Huntsville",
    company: "Mazda Toyota Manufacturing",
    image: "/images/InternHeadshots/3347071782.jpg",
    description:
      "Kyler enjoys working on cars in his spare time, including a 1993 Geo Tracker that was passed down to him and has been his project car for the past two years. During his internship at Mazda Toyota Manufacturing, he hopes to learn more about kaizen, or continuous improvement, and how to incorporate it into his everyday life.",
  },
  {
    name: "Emily Holcombe",
    education:
      "Senior, Operations Management with minors in Supply Chain Management and Communication Studies — The University of Alabama",
    company: "Mercedes-Benz",
    image: "/images/InternHeadshots/9032932235.jpg",
    description:
      "Originally from Texas, Emily enjoys reading outside, line dancing, and finding unique ways to add adventure to her busy lifestyle. Through her internship at Mercedes-Benz, she hopes to gain hands-on experience in process improvement, apply Lean and DMAIC strategies, and work in a fast-paced, quality-focused manufacturing environment.",
  },
  {
    name: "Camryn Horrison",
    education:
      "Senior, Logistics and Supply Chain Management — Alabama A&M University",
    company: "Mazda Toyota Manufacturing",
    image: "/images/InternHeadshots/2566521583.jpg",
    description:
      "Camryn enjoys working out at the gym, playing basketball, and spending time with family and friends. During his internship at Mazda Toyota Manufacturing, he has gained valuable hands-on experience in supply chain operations, working with real data to solve real-world problems, and collaborating across multiple teams. The experience has strengthened his skills in manufacturing processes, data analytics, and cross-functional communication.",
  },
];

export default function InternSpotlightsPage() {
  return (
    <main
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "#F2F3F4",
        minHeight: "100vh",
        fontFamily: "proxima-nova, sans-serif",
      }}
    >
      <HeadingIntroBanner
        title="Intern Spotlights"
        backgroundImage="/images/Headers/SuccessStories.png"
        backgroundPosition="center"
        height="20em"
      />

      <section
        className="px-5 md:px-8"
        style={{
            paddingTop: "3rem",
            paddingBottom: "7rem",}}>
        <div className="mx-auto w-full max-w-[1150px]">
          {/* Intro */}
          <div className="mx-auto mb-14 max-w-[800px] text-center">
            <h1
              className="mb-5 text-[1.75rem] font-bold leading-tight md:text-[3rem]"
              style={{
                color: "#35363B",
              }}
            >
              Meet a few of the talented interns making an impact across Alabama through APC partnerships!
            </h1>
          </div>

          {/* Spotlights */}
            <div
            className="flex flex-col"
                style={{
                    gap: "3rem",}}>
            {internSpotlights.map((intern, index) => {
              const imageOnRight = index % 2 !== 0;
              return (
                <article
                    key={intern.name}
                    className={`intern-spotlight-card ${
                        imageOnRight ? "intern-spotlight-card-reversed" : ""
                    }`}
                    >
                    {/* Headshot */}
                    <div className="intern-spotlight-image-container">
                        <Image
                            src={intern.image}
                            alt={`${intern.name} headshot`}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            style={{
                                objectFit: "cover",
                                objectPosition: intern.imagePosition ?? "center top",
                            }}
                            />
                    </div>

                    {/* Information */}
                    <div className="intern-spotlight-content">
                        <div className="intern-spotlight-accent" />

                        <h2 className="intern-spotlight-name">
                        {intern.name}
                        </h2>

                        <p className="intern-spotlight-education">
                        {intern.education}
                        </p>

                        <p className="intern-spotlight-company">
                        Internship Company: {intern.company}
                        </p>

                        <p className="intern-spotlight-description">
                        {intern.description}
                        </p>
                    </div>
                    </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
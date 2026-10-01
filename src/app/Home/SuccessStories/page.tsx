'use client';

import React from 'react';
import Image from 'next/image';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';
import Link from 'next/link';

interface SuccessStory {
  id: number;
  image: string;
  imagePadding?: string;
  text: string;
  attribution?: string;
  link: string;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    image: '/images/Logos/commerce.png',
    text: 'In August 2026, the Alabama Department of Commerce received "Unconditional Approval" to receive ISO 9001:2015 certification, making Alabama the only state in the United States with this distinction.',
    link: '/Home/SuccessStories/Commerce'
  },
  {
    id: 2,
    image: '/images/Logos/stbunn.webp',
    text: 'We believe this program has the potential to save our company money on hauling costs by allowing us to analyze trucking performance in ways that were not previously practical. It should help us compare costs, identify inefficiencies, evaluate truck usage and hauling times, and make better-informed operating decisions.',
    attribution: '– Taylor Davis, Vice President, S T Bunn Construction',
    link: '/Home/SuccessStories/STBunn'
  },
  {
    id: 3,
    image: '/images/Backgrounds/Lear.jpg',
    text: 'Anabelle has been a vital member to the team. She has been responsible for the plant\'s change notification process, making sure that responsible parties acknowledge notification and submit documentation in a timely manner. Anabelle has led the team in AI integration for the automation of processes.',
    attribution: '– Konrad Piepke, Engineering Change Coordinator',
    link: '/Home/SuccessStories/Lear'
  },
  {
    id: 4,
    image: '/images/Backgrounds/motherson_logo.jpg',
    text: 'For Motherson to be able to more accurately gauge improvement opportunities they partnered with APC to perform time studies throughout their facilities serving MBUSI. APC began this work by performing standard time-studies for each assembly line.',
    link: '/Home/SuccessStories/Motherson'
  },
  {
    id: 5,
    image: '/images/Backgrounds/CapstoneA.CulvColl.AlProdCtr.png',
    text: 'Through the projects I completed at the APC, I was able to learn relevant programming skills that I am still able to apply today at other companies. Working at the APC will teach you more than just how to be a programmer. You will learn skills on how to be a database manager, a project manager, and how to deal with general business activities such as reviewing resumes, marketing the company, and helping improve the overall workflow of the system. I believe that the APC offers very rewarding experiences that a lot of students won\'t be able to find anywhere else during the school year.',
    attribution: '– Jared Waller, MIS Intern',
    link: '/Home/SuccessStories/APC'
  },
  {
    id: 6,
    image: '/images/Backgrounds/SheltonState.png',
    text: 'A collaboration between the Alabama Productivity Center (APC) and Shelton State Community College (SSCC) supported the ARC Alabama STRONG Internship Program which was piloted to engage two students from each institution with industry during the Spring 2021 semester. Alabama STRONG student internships are designed to provide work-based learning experiences that complement the student\'s related education and training provided by the university/college. The experience also allows interns the opportunity to work with someone from a different institution and discipline.',
    link: '/Home/SuccessStories/SheltonState'
  },
  {
    id: 7,
    image: '/images/Logos/toyotaalabamalogo.png',
    text: 'As a summer intern at Toyota Motor Manufacturing with the Alabama Productivity Center, I was able to gain a better understanding of the career field that I was preparing for. My experience at Toyota also connected me with great people who have played a big role in the start of my career.',
    attribution: '– Hayden D. Bevil, PC, PPM Specialist',
    link: '/Home/SuccessStories/Toyota'
  },
  {
    id: 8,
    image: '/images/Logos/austal.png',
    imagePadding: '2%',
    text: 'Throughout Thomas\' internship, he produced around $80,000 in cost savings improvements just through additive manufacturing. Since he created the designs to 3D print that number of savings will continue to increase as more parts are printed.',
    link: '/Home/SuccessStories/Austal'
  },
  {
    id: 9,
    image: '/images/Logos/precision.png',
    text: 'The University of Alabama ATN Center is a great resource for our business. They are quick to respond and provide the highest level of service. Their internship program has provided great young talent that are able to take on important projects needed to sustain our business. This is a great program for the manufacturing industry in our state.',
    attribution: '– Chase Fell, VP of Engineering',
    link: '/Home/SuccessStories/Precision'
  },
  {
    id: 10,
    image: '/images/Logos/steris.png',
    text: 'The project that Olivia accomplished in Animal Health will have a lasting impact on our business. There was so much this summer that we needed help with, to take our business to the next level and I feel like we accomplished it. With Olivia\'s help on the tape characterization project we were able to un-quarantine $10,000 worth of products to use in production. There were tons more projects she helped us with as well this summer. Without her we would not have been able to make such huge strides. We are very lucky that you gave us the opportunity to meet and work Olivia.',
    attribution: '– Leigh Oncale, Director, Lean Operations',
    link: '/Home/SuccessStories/Steris'
  },
  {
    id: 11,
    image: '/images/Logos/sheco.png',
    text: 'Our intern, Marcus Taylor, has been able to make excellent progress…better than we expected on the project to improve the engineering drawing production process. We are near the original schedule despite being able to expand the capabilities of the program significantly.',
    attribution: '– Jeremy Wolfe, Engineering Manager',
    link: '/Home/SuccessStories/SHECO'
  },
  {
    id: 12,
    image: '/images/Logos/evonik.png',
    text: 'The Alabama Productivity Center intern routinely took initiative and found work by listening in meetings and asking questions. She demonstrated a sound technical background by accurately performing engineering calculations to estimate the time it would take to perform a liquid-liquid azeotropic distillation.',
    attribution: '– Randy Rogers, Director, Site Communications and Government Affairs',
    link: '/Home/SuccessStories/Evonik'
  },
  {
    id: 13,
    image: '/images/Logos/MTM Logo.jpeg',
    text: 'Travis left a vital impact on the Accounting & Finance Department. His analytical skills were critical in creating new processes for improving forecasting metrics on the Treasury side. He also provided vital support in many Treasury activities critical to maintaining proper company standing.',
    attribution: '– Theodore Kubista, Financial Reporting, Insurance & Treasury Specialist',
    link: '/Home/SuccessStories/MTM'
  }
];

export default function SuccessStoriesPage() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* Header Section */}
      <HeadingIntroBanner
        title="Success Stories"
        backgroundImage="/images/Headers/SuccessStories.png"
        backgroundPosition="bottom"
        height="20em"
      />


      {/* Success Stories Section */}
      <div className="w-full bg-white">
        {successStories.map((story, index) => (
          <React.Fragment key={story.id}>
            <div
              className="w-full bg-white transition-colors duration-600 success-story-row"
              style={{
                paddingTop: index === 0 ? '40px' : '2em',
                paddingBottom: '2em',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e1e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <div className="w-full" style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-start', width: '100%', boxSizing: 'border-box', justifyContent: 'center' }}>
                {/* Image column */}
                <div style={{ width: '35%', flexShrink: 0, boxSizing: 'border-box', paddingLeft: '15px', paddingRight: '15px' }}>
                  <Image
                    src={story.image}
                    alt={`${story.id} logo`}
                    width={400}
                    height={300}
                    className="w-full"
                    style={{
                      width: '75%',
                      paddingTop: story.imagePadding || '3%',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Text column */}
                <div style={{ width: '55%', flexShrink: 0, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', paddingLeft: '15px', paddingRight: '15px', overflow: 'hidden' }}>
                  {/* Text at the top */}
                  <p
                    style={{
                      color: 'black',
                      fontSize: '1.5em',
                      fontFamily: 'proxima-nova, sans-serif',
                      lineHeight: '1.6',
                      marginBottom: story.attribution ? '0.75em' : '1em',
                      marginTop: 0,
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%'
                    }}
                  >
                    {story.text}
                  </p>
                  
                  {/* Attribution/subtitle if any */}
                  {story.attribution && (
                    <p
                      style={{
                        color: 'black',
                        fontSize: '1.3em',
                        fontFamily: 'proxima-nova, sans-serif',
                        fontWeight: 'bold',
                        marginBottom: '1em',
                        marginTop: 0,
                        textAlign: 'right',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        maxWidth: '100%'
                      }}
                    >
                      {story.attribution}
                    </p>
                  )}
                  
                  {/* Button at the bottom */}
                  <div>
                    <Link
                      href={story.link}
                      className="homepageButton boxshadowEffect success-story-button"
                      style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        fontSize: '1.25em',
                        fontFamily: 'proxima-nova, sans-serif'
                      }}
                    >
                      Read the full story
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Rule separator */}
            {index < successStories.length - 1 && (
              <hr
                style={{
                  width: '100%',
                  color: 'black',
                  height: '1px',
                  backgroundColor: 'black',
                  border: 'none',
                  margin: '0'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

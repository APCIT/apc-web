'use client';

import React, { useState, useEffect } from 'react';
import { Accordion, AccordionItem } from '@heroui/accordion';
import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function ExpandedServicesPage() {
  const [selectedKeys, setSelectedKeys] = useState<"all" | Set<string>>(new Set());

  useEffect(() => {
    // Check if there's a hash in the URL and expand that section
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setSelectedKeys(new Set([hash]));
        // Scroll to the section after a brief delay
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const navbarHeight = 100;
            const extraPadding = 20;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - extraPadding;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  }, []);

  const services = [
    {
      id: 'qualityLoc',
      title: 'Quality',
      icon: '/images/Icons/Quality.png',
      color: '#212124',
      introText: "APC's quality services provide organizations the tools needed for effective and sustainable management systems.",
      expandedContent: (
        <div style={{ textAlign: 'left', width: '100%', paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0, boxSizing: 'border-box', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Quality Management System (QMS)
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, textAlign: 'left' }}>
            {`A formalized system that define an organization's processes, procedures, and responsibilities for achieving quality policies and objectives. The Alabama Productivity Center (APC) assists organizations who have existing QMS's or those looking to implement a system in conformance to ISO 9001, IATF 16949, AS9100, ISO 13485 and others. Our services include second party audits, training, implementation of systems, and coaching.`}
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Industry Expertise
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, textAlign: 'left' }}>
            APC is staffed by industry experts who have training and years of experience working with these systems in various industries. In addition to quality, the center can assist organizations with ISO 14001 environmental management systems (EMS), and ISO 45001 occupational health and safety (OH&S) systems. Services also include second party audits, training, implementation of systems, and coaching.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Quality Training
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.6', marginTop: 0, textAlign: 'left' }}>
            APC quality training includes management systems overview, internal auditing, root cause analysis and problem solving, lean-six sigma yellow belt, lean-six sigma green belt and automotive core tool training statistical process control (SPC), failure modes and effects analysis (FMEA), production part approval process (PPAP), advanced product quality planning (APQP), and measurement system analysis (MSA). Training programs can be customized for specific industries.
          </p>
        </div>
      )
    },
    {
      id: 'leanLoc',
      title: 'Lean',
      icon: '/images/Icons/ProcessImprovement.png',
      color: '#212124',
      introText: 'Learn how to help your business processes gain efficiencies and, as a result, become more competitive in any marketplace, by reducing waste using tools such as 5S, kanban, kaizen, and one piece flow.',
      expandedContent: (
        <div style={{ textAlign: 'left', width: '100%', paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0, boxSizing: 'border-box', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Lean 101 - Principles of Lean
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Lecture and hands-on simulation introduce standardized work, workplace organization, visual controls, set-up reduction, batch size reduction, point-of-use storage, quality at the source, workforce practices and pull systems.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Lean Airplane
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            In this interactive session, participants work in a small Lego production line, experiencing its problems and apply Lean practices to overcome them.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Lean Office
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn the characteristics and benefits of a Lean office vs. a traditional office environment. Participants will learn how to categorize value added vs. non-value added activities in an office environment and learn ways to eliminate waste.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Lean Hospitality
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn how to incorporate Lean tools and concepts into your hospitality system.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            5S
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn how to transform a business into a place where information concerning product quality, productivity, schedule and safety are visually accessible at any given moment.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Pull / Kanban
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Pull/Kanban is based on the concept of building products or providing services based on actual consumption. The system uses visual signals when materials need to be replaced. Learn how to control work place inventory and production schedules by implementing pull systems, and how to design and implement a visually driven, employee controlled material replenishment system.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Cellular Flow
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn how to link and balance operations to reduce lead times, minimize work in process, optimize floor space usage and improve productivity, by understanding defining product families, takt time, total work content, work balancing, task/operator standardization, machine/operator optimization, cell layout, flexible staffing and teamwork.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Quick Changeover
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn the principles of setup reduction and standard methodology in applying SMED to any type of setup or industry.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Total Preventative Maintenance (TPM)
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn the 5 components of TPM, the 7 steps to autonomous maintenance, and how to proactively maintain machines and equipment at peak productivity.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Value Stream Mapping
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            {`Learn to identify where the value streams are in your operations, map them "from door-to-door" and realize the wastes that exist in the current processes. Armed with now being able to "see" the wastes, learn the process of constructing a future state of these value streams and instituting an implementation plan of achieving that future state, resulting in a successful value stream map, a tool to direct lean improvements.`}
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Kaizen Events
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn this proven way to implement Lean tools and concepts. Kaizen events are well-scoped, focused improvement efforts that utilize a team-based approach to eliminating wastes, the greatest benefit being nearly instantaneous recognition of improvement. Team members are empowered to offer and implement ideas, with aggressive goals set early in the process. Solutions are not simply put on paper but implemented by the team.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Kaizen Facilitator
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            This class is designed to teach the standard kaizen process so you can easily run your own kaizen event. Training includes on-floor kaizen event.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Problem Solving
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            {`Using exercises and a group "hands on" simulation, learn the A3 approach to communicate the problem and the teamwork involved in solving the problem, including root cause techniques.`}
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Lean Leadership
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.6', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn the benefits of Lean versus traditional management by applying four key elements including leader standard work, visual control, daily accountability, and leadership discipline. How to apply the A3 problem solving process, gemba walks, and job methods to developing a lean culture is presented along with a brief introduction to improvement kata and coaching kata.
          </p>
        </div>
      )
    },
    {
      id: 'industry_toolsLoc',
      title: 'Industry Tools',
      icon: '/images/Icons/IndustryTools.png',
      color: '#212124',
      introText: 'We offer training classes where you will learn a variety of Industry Tools that can be used to make your manufacturing business more effective. Tools include: APQP, PPAP, FMEA, SPC, and MSA.',
      expandedContent: (
        <div style={{ textAlign: 'left', width: '100%', paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0, boxSizing: 'border-box', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Quality Core Tools, used in manufacturing sectors, such as aerospace, defense, medical, and pharmaceutical, include Advanced Product Quality Planning & Control Plan (APQP), Production Part Approval Process (PPAP), Failure Mode and Effects Analysis (FMEA), Statistical Process Control (SPC) and Measurement System Analysis (MSA). These tools are the building blocks of an effective quality management system.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Core Tools Overview
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            This course will provide a brief summary of the Core Tools APQP, PPAP, FMEA, SPC, and MSA.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            APQP and Control Plans
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Using examples and exercises, Advanced Product Quality Planning (APQP) and Control Plans training class takes you step-by-step through the common requirements and the information you need to build these plans and achieve compliance.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            PPAP
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Using examples and exercises, Production Part Approval Process (PPAP) training provides an understanding of the information and the process required to obtain part approval prior to manufacturing the part.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            FMEA
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Using examples and exercises, this course follows a step-by-step method for conducting and developing Failure Mode and Effects Analysis (FMEA). Participants will learn how to assess risk and determine the levels of risk that trigger mitigation actions.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            SPC
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Statistical Process Control (SPC) training will walk you through the details of control charting and other SPC procedures and how to apply them within your organization. The use of Minitab is presented along with exercises.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            MSA (GRR)
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.6', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Learn how to understand the error associated with measurement systems and their impact on making correct decisions using Measurement Systems Analysis (MSA). The course starts with describing measurement error and then guides you in a step-by-step manner to conduct or evaluate your own Bias, Linearity and Stability studies. The course ends with how you can determine your gauge R&R (repeatability and reproducibility). You will be able to gage the extent of variation and the source of variation. The course includes examples of Linearity, Bias, Stability studies and tools such as an Excel spreadsheet and Minitab to record and determine Gauge R&R for attribute and variables data.
          </p>
        </div>
      )
    },
    {
      id: 'technologyLoc',
      title: 'Technology & Marketing',
      icon: '/images/Icons/Technology (1).png',
      color: '#212124',
      introText: 'Need a company website? Need help marketing your product or service? Need assistance with data analysis?',
      expandedContent: (
        <div>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Website Design
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Need a new website? Need a redesign of your website? APC has worked with many companies to fit exactly what they are looking for into their websites. 100% customizable and user friendly! Through the use of innovative interns and the APC staff, we can get the exact look you are searching for.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Marketing
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            {`Rebranding? Need new logos, handouts, reports and more? We work directly with you to find exactly what fits your needs in all aspects of marketing materials. Not sure where to start? Let's brainstorm together! You can never go wrong with a free consultation.`}
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Data Analysis
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.6', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Every company collects data but is it the correct data specific to your need? Through our internship program, we can analyze data to track trends, see breaks and even expand on certain areas you might already be collecting in. Data mining is growing in all aspects of business. Let us help you collect the correct, precise and essential data you need to be looking at to grow your business.
          </p>
        </div>
      )
    },
    {
      id: 'designLoc',
      title: 'Design & Additive Mfg.',
      icon: '/images/Icons/Design.png',
      color: '#212124',
      introText: 'Do you need help with Design? Plant Layouts? CAD? Want to explore 3-D Printing? We have in-house capability to take any idea from concept to complete shop drawings.',
      expandedContent: (
        <div style={{ textAlign: 'left', width: '100%', paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0, boxSizing: 'border-box', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Product Design
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Do you have a concept that you would like to make a reality? Let us help you develop your idea into actionable shop drawings complete with a bill of material.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Plant Layout
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Are you considering an update to your plant layout? Let us help coordinate the change by capturing your current layout and updating the plans to the future layout. This will improve the planning process and reduce downtime.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            CAD
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            {`Do you need CAD support? We can help with training or if you don't have in-house drafters, let APC be your design department.`}
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            3D Printing
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.6', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            APC can help with your 3D printing needs. Whether you are prototyping a new part or need production 3D printed parts we can help.
          </p>
        </div>
      )
    },
    {
      id: 'leadershipLoc',
      title: 'Leadership',
      icon: '/images/Icons/Leadership.png',
      color: '#212124',
      introText: 'Learn leadership skills to move your organization or department forward, focusing on communication, time management, and developing people.',
      expandedContent: (
        <div>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Time Management
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            In this class, you will better understand where all of your time is going and how to prioritize, plan and handle interruptions.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Effective Communication and Crucial Conversations
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            This class examines Personality Styles, Communication Preferences, and Emotional Intelligence. Learn to be an effective communicator and how to improve employee engagement.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Coaching and Developing People
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.75', marginBottom: '0.6em', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            In this class you will learn the difference between management and leadership. Discover how to influence and connect with team members. Learn about Situational Leadership and Team Building.
          </p>
          <h3
            style={{
              color: 'white',
              fontFamily: 'proxima-nova, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginTop: '1.75rem',
              marginBottom: '.75rem'
            }}
          >
            Training Within Industry (TWI)
          </h3>
          <p style={{ fontSize: '1.08rem', fontFamily: 'proxima-nova, sans-serif', color: 'white', lineHeight: '1.6', marginTop: 0, marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Develops frontline supervisors, team leaders and workers as the foundation for sustainable results in the workplace. TWI consists of core programs that build skills, stability and safety. Started in 1940 with the United States Department of War and operated within the War Manpower Commission until 1945, TWI was developed to meet the high demand for wartime materials from a smaller and less experienced workforce. The companies putting TWI in place increased production, reduced labor, scrap and training time and saw grievances drop dramatically. The United States brought TWI to Japan in the 1950s where it became the foundational component of the Toyota Production System (TPS).
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Header Section */}
      <HeadingIntroBanner
        title="Service Details"
        backgroundImage="/images/factory1.jpg"
        backgroundPosition="bottom"
      />

      {/* Services Details Section */}
    <div style={{ marginBottom: '4rem' }}>
      <Accordion
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys as "all" | Set<string>)}
        className="w-full"
        itemClasses={{
          base: "serviceDetailsRow",
          trigger: "py-0 px-0 w-full",
          content: "py-0 px-0",
          heading: "py-0 px-0 w-full"
        }}
        showDivider={false}
      >
        {services.map((service) => (
          <AccordionItem
            key={service.id}
            id={service.id}
            aria-label={service.title}
            title={
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}>
              {/* Shared inner container with fixed max width */}
              <div style={{
                width: '100%',
                maxWidth: '1232px',
                display: 'flex',
                padding: '1rem 2rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem',
                margin: '0 auto',
              }}>
                {/* Image Column - fixed 550px width */}
                <div style={{
                  width: '120px',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  paddingLeft: 0,
                  paddingRight: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {/* Explicit Image Container */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box'
                  }}>
                    <img
                      src={service.icon}
                      alt={service.title}
                      style={{
                        width: '56px',
                        height: '56px',
                        display: 'block'
                      }}
                    />
                  </div>
                </div>

                {/* Title Column */}
                  <div style={{
                    flex: 1,
                    minWidth: '300px',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                  }}>

                  <h1
                    style={{
                      textAlign: 'left',
                      color: 'white',
                      fontSize: '2rem',
                      lineHeight: '1.2',
                      marginBottom: 0,
                      marginTop: 0,
                      marginLeft: 0,
                      marginRight: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      fontFamily: 'proxima-nova, sans-serif',
                      fontWeight: 800,
                      width: 'auto'
                    }}
                  >
                    {service.title}
                  </h1>
                </div>
                {(() => {
                    const isOpen = selectedKeys === 'all' || (selectedKeys instanceof Set && selectedKeys.has(service.id));
                    if (isOpen) return null; // Hide top button when expanded
                    return (
                      <div
                        className="homepageButton boxshadowEffect"
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentKeys = selectedKeys instanceof Set ? selectedKeys : new Set<string>();
                          const newKeys = new Set<string>(currentKeys);
                          newKeys.add(service.id);
                          setSelectedKeys(newKeys);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            const currentKeys = selectedKeys instanceof Set ? selectedKeys : new Set<string>();
                            const newKeys = new Set<string>(currentKeys);
                            newKeys.add(service.id);
                            setSelectedKeys(newKeys);
                          }
                        }}
                        style={{
                          fontSize: '1rem',
                          fontFamily: 'proxima-nova, sans-serif',
                          width: 'auto',
                          padding: '0.6rem 1.25rem',
                          alignSelf: 'center',
                          marginTop: 0,
                          borderRadius: '999px',
                          cursor: 'pointer'
                        }}
                      >
                        View Details
                      </div>
                    );
                  })()}
              </div>
            </div>
            }
            classNames={{
              base: `serviceDetailsRow service-${service.id}`,
              trigger: "py-0 px-0 w-full",
              content: "py-0 px-0",
              heading: "py-0 px-0 w-full",
              title: "w-full"
            }}
            style={{
              '--service-bg-color': service.color
            } as React.CSSProperties}
            indicator={<div></div>}
          >
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              boxSizing: 'border-box'
            }}>
              {/* Shared inner container with fixed max width - matches title structure */}
              <div style={{
                width: '100%',
                maxWidth: '1200px',
                display: 'flex',
                flexWrap: 'nowrap',
                padding: '0',
                alignItems: 'flex-start',
                boxSizing: 'border-box'
              }}>
                {/* Spacer Column - fixed 220px width, matches icon column */}
                <div style={{
                  width: '220px',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  paddingLeft: 0,
                  paddingRight: 0
                }}></div>

                {/* Content Container - takes remaining space, aligned with title */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minWidth: '300px',
                  alignItems: 'flex-start',
                  boxSizing: 'border-box',
                  paddingLeft: '0',
                  paddingRight: '0',
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <p
                    style={{
                      textAlign: 'left',
                      color: 'white',
                      fontSize: '1.08rem',
                      lineHeight: '1.75',
                      marginBottom: '0.6em',
                      marginTop: 0,
                      marginLeft: 0,
                      marginRight: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      fontFamily: 'proxima-nova, sans-serif',
                      width: '100%'
                    }}
                  >
                    {service.introText}
                  </p>
                  {service.expandedContent}
                  {(() => {
                    const isOpen = selectedKeys === 'all' || (selectedKeys instanceof Set && selectedKeys.has(service.id));
                    if (!isOpen) return null; // Hide bottom button when collapsed
                    return (
                      <button
                        className="homepageButton boxshadowEffect"
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentKeys = selectedKeys instanceof Set ? selectedKeys : new Set<string>();
                          const newKeys = new Set<string>(currentKeys);
                          newKeys.delete(service.id);
                          setSelectedKeys(newKeys);
                        }}
                        style={{
                          fontSize: '1rem',
                          fontFamily: 'proxima-nova, sans-serif',
                          width: 'auto',
                          alignSelf: 'flex-start',
                          marginTop: '0.5em',
                          marginBottom: '1.5em'
                        }}
                      >
                        Hide Info
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
     </div>

      {/* Contact Form Section */}
        <section className="contact-section">
          <div className="contact-container">
            <h2 className="contact-title">How Can We Help You? We do more, just ask!</h2>
            <div className="contact-title-line" />
            <form className="contact-form" aria-label="Request services">
              <div className="contact-field">
                <label htmlFor="expanded-services-contact-name" className="contact-label">Name</label>
                <input
                  type="text"
                  id="expanded-services-contact-name"
                  name="name"
                  required
                  aria-required="true"
                  autoComplete="name"
                  className="contact-input"
                />
              </div>
              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="expanded-services-contact-email" className="contact-label">Email</label>
                  <input
                    type="email"
                    id="expanded-services-contact-email"
                    name="email"
                    required
                    aria-required="true"
                    autoComplete="email"
                    className="contact-input"
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="expanded-services-contact-phone" className="contact-label">Phone</label>
                  <input
                    type="tel"
                    id="expanded-services-contact-phone"
                    name="phone"
                    autoComplete="tel"
                    className="contact-input"
                  />
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="expanded-services-contact-company" className="contact-label">Company</label>
                <input
                  type="text"
                  id="expanded-services-contact-company"
                  name="company"
                  autoComplete="organization"
                  className="contact-input"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="expanded-services-contact-services" className="contact-label">Services requested</label>
                <input
                  type="text"
                  id="expanded-services-contact-services"
                  name="services"
                  className="contact-input"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="expanded-services-contact-message" className="contact-label">Message</label>
                <textarea
                  id="expanded-services-contact-message"
                  name="message"
                  rows={5}
                  required
                  aria-required="true"
                  className="contact-input contact-textarea"
                />
              </div>
              <button type="submit" className="contact-submit">
                Send Message →
              </button>
            </form>
          </div>
        </section>
    </div>
  );
}

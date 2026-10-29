export type ServiceItem = {
  id: string;
  title: string;
  /** Hours of training, when shown on the catalog slide */
  hours?: number;
  /** Whether a certificate is awarded */
  certificate?: boolean;
  /** Optional "Topics of Discussion" / offerings list from the catalog */
  topics?: string[];
  paragraphs: string[];
};

export type ServiceColumnItem = {
  title: string;
  /** Nested accordion item id on ExpandedServices */
  itemId: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  icon: string;
  /** Short blurb under the category title on ExpandedServices */
  introText: string;
  /** PDF TOC ribbon color */
  accentColor: string;
  /** Text color on accent backgrounds */
  accentTextColor: string;
  /** Titles shown as bullets on the Services page (matches PDF TOC) */
  columnItems: ServiceColumnItem[];
  items: ServiceItem[];
};

/** Public catalog PDF served via app proxy (Azure container may be private). */
export const CATALOG_PDF_CONTAINER = 'staff-only-materials';
export const CATALOG_PDF_BLOB = 'APC Professional Services Catalog 2026.pdf';
export const CATALOG_PDF_URL =
  '/api/public-files/staff-only-materials/APC%20Professional%20Services%20Catalog%202026.pdf';

/** Embed URL — hides thumbnail sidebar, fits page to viewer width */
export const CATALOG_PDF_EMBED_URL = `${CATALOG_PDF_URL}#navpanes=0&scrollbar=1&view=FitH`;

/** Matches the four TOC ribbon colors in the 2026 catalog (no brand red). */
export const professionalServices: ServiceCategory[] = [
  {
    id: 'continuous-improvement',
    title: 'Continuous Improvement',
    icon: '/images/Icons/ProcessImprovement.png',
    accentColor: '#80888C',
    accentTextColor: '#FFFFFF',
    introText:
      'Continuous Improvement is a structured approach to identifying inefficiencies, improving processes, eliminating waste, and increasing customer value. Rather than relying on large, one-time changes, it builds a culture of ongoing improvement driven by the people closest to the work. Organizations that embrace continuous improvement strengthen performance, increase efficiency, enhance customer satisfaction, and empower employees to solve problems proactively. APC’s training equips organizations across any industry or function with practical skills to streamline operations, reduce costs, and achieve sustainable, measurable results.',
    columnItems: [
      { title: 'Kaizen Events Facilitation', itemId: 'kaizen-events' },
      { title: 'Lean Manufacturing', itemId: 'lean-manufacturing' },
      { title: 'Lean Office & Lean Hospitality', itemId: 'lean-office-hospitality' },
      { title: 'Problem Solving', itemId: 'problem-solving' },
      { title: 'Total Preventive Maintenance (TPM)', itemId: 'tpm' },
      { title: 'Value Stream Mapping (VSM)', itemId: 'value-stream-mapping' },
      { title: '5S Workplace Organization', itemId: '5s' },
      { title: 'Lean Implementation', itemId: 'lean-implementation' },
    ],
    items: [
      {
        id: 'kaizen-events',
        title: 'Kaizen Events Facilitation',
        certificate: true,
        topics: [
          'Developing a Team Charter',
          'Action Planning & Rapid Implementation',
          'Understanding Current State & Future State',
          'Mapping Material & Informational Flow',
          'Planning & Executing Kaizen Events',
          'Defining Event Scope & Objectives',
          'Identifying Wastes & Root Causes',
          'Sustaining Improvements',
        ],
        paragraphs: [
          'Kaizen Event Facilitation training prepares participants to successfully plan, lead, and sustain focused improvement events that deliver measurable results in a short timeframe. Kaizen events bring cross-functional teams together to analyze processes, identify inefficiencies, and implement meaningful improvements quickly and effectively.',
          'This course equips participants with the structure, facilitation techniques, and leadership skills needed to guide teams from problem identification through implementation while building engagement and accountability. Training content and duration are customized to meet your organization’s needs.',
        ],
      },
      {
        id: 'lean-manufacturing',
        title: 'Lean Manufacturing',
        hours: 4,
        certificate: true,
        topics: [
          'House of Lean Introduction',
          'Define Value Stream',
          '5S Workplace Organization',
          '8-Wastes of Lean',
          'Cellular Flow',
          'Takt Time vs Cycle Time',
          'Point of Use Storage',
          'Batch vs Single-Piece Flow',
          'Value-Added vs Non-Value-Added Activities',
          'Visual Controls',
          'Quality at the Source',
          'Pull System & Kanban',
          'Sustaining Lean Culture',
          'Line Balancing',
          'Standard Work',
          'Benefit of Lean Manufacturing',
        ],
        paragraphs: [
          'This hands-on workshop provides an overview of Lean Manufacturing principles and tools. Participants will explore how to identify waste, streamline processes, and foster a culture of continuous improvement. Utilizing a Lego airplane assembly line, attendees will learn to apply Lean Solutions to everyday opportunities and acquire the skills and mindset necessary to implement Lean concepts in their own manufacturing environments.',
        ],
      },
      {
        id: 'lean-office-hospitality',
        title: 'Lean Office & Lean Hospitality',
        hours: 8,
        certificate: true,
        paragraphs: [
          'Lean Office: This course applies Lean Thinking to office and administrative environments. Participants will learn how to identify hidden waste in everyday tasks such as emails, approvals, paperwork, and meetings. After determining the wastes, this course will show you how to apply the Lean tools to streamline operations, improve accuracy, and create more value with less effort. Designed for all office settings, such as finance, HR, customer services, and procurement, with a practical hands-on activity to help participants not just understand Lean tools but also how to apply them.',
          'Lean Hospitality: This interactive course introduces participants to Lean Principles specifically adapted for the hospitality industry. Participants will explore how to identify inefficiencies, reduce waste, and improve guests’ satisfaction through simple, practical lean tools. Using relatable hospitality scenarios and interactive activities, participants will develop the mindset and skills needed to streamline processes, empower employees, and create a culture of continuous improvement.',
        ],
      },
      {
        id: 'problem-solving',
        title: 'Problem Solving',
        hours: 4,
        certificate: true,
        topics: [
          'PDCA - Plan, Do, Check, Adjust',
          '8 Steps of Problem Solving',
          'A3 Problem Solving',
          'Problem Statement',
          'Pareto Principle',
          'Measuring Results',
          'Root Cause Analysis',
          '5 Why',
          'Fishbone Diagram',
          'Action Plan & Countermeasures',
        ],
        paragraphs: [
          'This immersive course equips professionals with advanced tools and techniques to solve complex problems, eliminate recurring issues, and drive lasting improvements. Going beyond basic troubleshooting, participants will learn how to apply structured methodologies such as A3, 5 Whys, Fishbone Diagrams, and PDCA. An emphasis is placed on team-based problem-solving, root cause validation, and implementing countermeasures that are effective and sustainable. Utilizing our Lean Manufacturing simulation, participants will apply these techniques to real problems.',
        ],
      },
      {
        id: 'tpm',
        title: 'Total Preventive Maintenance (TPM)',
        hours: 4,
        certificate: true,
        topics: [
          'Overview of TPM',
          'Overall Equipment Effectiveness (OEE)',
          '7 Steps of Autonomous Maintenance',
          'Concept of Zero Failure',
          '5 Phases of a TPM Roadmap',
          'Ownership & Shared Responsibility',
          'Establishing TPM Policies & Goals',
          'Eliminating Breakdowns',
          'Life Cycle Costs',
          'Approach to Improvement',
        ],
        paragraphs: [
          'This hands-on workshop provides an in-depth overview of Total Preventive Maintenance (TPM) and its essential role in sustaining equipment performance and improving reliability. Through training and case studies, participants will gain a practical understanding of the 5 Phases of Implementation and the 7 Steps of Autonomous Maintenance. They will learn how to proactively maintain machines, equipment, and facilities to minimize downtime and enhance overall productivity. Participants will leave with the knowledge and skills needed to support a TPM culture in their own operations.',
        ],
      },
      {
        id: 'value-stream-mapping',
        title: 'Value Stream Mapping (VSM)',
        certificate: true,
        topics: [
          'Introduction to VSM',
          'Understanding Current State vs Future State Maps',
          'Mapping Material & Information Flow',
          'Capturing Data & Process Metrics',
          'Linking VSM to Business Goals & Metrics',
          'Identifying Waste & Bottlenecks',
          'Developing an Implementation Plan',
          'Identifying Process Boundaries',
        ],
        paragraphs: [
          'Value Stream Mapping (VSM) teaches participants to visually map and analyze the flow of materials, information, and activities required to deliver a product or service. By identifying bottlenecks, delays, and non-value-added steps, participants uncover opportunities for improvement.',
          'Through hands-on activities, participants learn to design a future state that improves efficiency, reduces waste, and enhances customer value. Training content and duration are customized to meet your organization’s needs.',
        ],
      },
      {
        id: '5s',
        title: '5S Workplace Organization',
        hours: 4,
        certificate: true,
        topics: [
          'House of Lean Introduction',
          'Value-Added vs Non-Value-Added Activities',
          '8-Wastes of Lean',
          'Sort',
          'Set in Order',
          'Shine',
          'Standardize',
          'Sustain',
        ],
        paragraphs: [
          'This focused, hands-on course dives into 5S Workplace Organization. 5S is a foundational Lean tool for improving safety, productivity, and workplace culture. More than just cleaning and organizing, 5S is a comprehensive system that promotes visual control, efficiency, and a sense of pride in the workplace. Through group activities, participants will leave ready to launch a 5S initiative in their workplace.',
        ],
      },
      {
        id: 'lean-implementation',
        title: 'Lean Implementation',
        topics: [
          'Lean leadership training',
          'Current State Process analysis & bottleneck identification',
          'Kaizen event facilitation',
          'Waste reduction initiatives',
          'Continuous improvement system development',
        ],
        paragraphs: [
          'APC’s Lean Implementation services move beyond training to hands-on operational improvement. We begin by equipping leadership and teams with foundational lean principles, then work directly alongside your staff to identify bottlenecks, eliminate waste, and close performance gaps.',
          'Our structured approach ensures improvements are practical, measurable, and sustainable.',
        ],
      },
    ],
  },
  {
    id: 'quality',
    title: 'Quality',
    icon: '/images/Icons/Quality.png',
    accentColor: '#000000',
    accentTextColor: '#FFFFFF',
    introText:
      'These hands-on workshops provide an overview of Quality Management Systems (QMS) and industry best practices. Participants will explore tools and strategies to develop, implement, and sustain effective quality systems in their organizations. Through practical examples and exercises, attendees will acquire the skills and mindset necessary to enhance processes, ensure compliance with international standards, and improve organizational performance. No prior QMS experience required.',
    columnItems: [
      { title: 'AS9100 & ISO 9001', itemId: 'as9100' },
      { title: 'IATF 16949 & Industry Core Tools', itemId: 'iatf-16949' },
      { title: 'ISO 19011', itemId: 'iso-19011' },
      { title: 'ISO 45001 & ISO 14001', itemId: 'iso-45001' },
      { title: 'ISO Implementation', itemId: 'iso-implementation' },
    ],
    items: [
      {
        id: 'as9100',
        title: 'AS9100',
        hours: 8,
        certificate: true,
        paragraphs: [
          'AS9100 provides a comprehensive overview of the aerospace quality management system standard and its alignment with ISO 9001 requirements. This course prepares organizations to understand, implement, and maintain a compliant QMS that meets the stringent requirements of the aerospace and defense industries.',
          'Participants gain practical insight into risk management, product safety, configuration control, and operational discipline necessary to achieve and sustain certification.',
        ],
      },
      {
        id: 'iso-9001',
        title: 'ISO 9001',
        hours: 8,
        certificate: true,
        paragraphs: [
          'ISO 9001:2015 Quality Management Systems provides a practical understanding of the ISO 9001 Standard and how to develop, implement, and sustain an effective QMS. Participants learn how a structured quality management system improves consistency, reduces risks, increases customer confidence, and supports organizational performance.',
          'This course translates the standard’s requirements into clear, actionable steps that can be applied across industries or service providers seeking certification or strengthening internal quality practices.',
        ],
      },
      {
        id: 'iatf-16949',
        title: 'IATF 16949',
        hours: 8,
        certificate: true,
        paragraphs: [
          'IATF 16949 provides a comprehensive overview of the automotive quality management system standard and its alignment with ISO 9001 requirements. This course prepares organizations to understand, implement, and maintain a compliant, effective QMS that meets the rigorous expectations of automotive customers and their supply chains.',
          'Participants gain clarity on standard requirements, risk-based thinking, process control, and continuous improvement practices necessary to achieve and sustain certification.',
        ],
      },
      {
        id: 'industry-core-tools',
        title: 'Industry Core Tools',
        hours: 8,
        certificate: true,
        paragraphs: [
          'This hands-on training provides an overview of essential Industry Tools used to improve effectiveness in manufacturing environments. Participants will explore key tools that form the foundation of a robust Quality Management System and acquire practical skills to apply them in various manufacturing sectors, including aerospace, defense, medical, pharmaceutical, and others. No prior experience with these tools is required.',
        ],
      },
      {
        id: 'iso-19011',
        title: 'ISO 19011',
        hours: 8,
        certificate: true,
        topics: [
          'Overview of ISO 19011 Guidelines',
          'Principles of Auditing',
          'Auditor Roles & Responsibilities',
          'Developing Audit Programs & Plans',
          'Reporting Findings & Writing Nonconformities',
          'Leading a Management Review Meeting',
          'Follow-Up & Corrective Action Verification',
          'Conducting Audit Interviews & Gathering Evidence',
        ],
        paragraphs: [
          'ISO 19011 provides guidance on auditing management systems, including quality, environmental, and occupational health and safety standards. This course equips participants with the knowledge and skills necessary to plan, conduct, and manage effective internal audits that drive compliance, performance improvement, and organizational accountability.',
          'Participants gain practical insight into audit principles, risk-based auditing, and the competencies required to evaluate management systems objectively and professionally.',
        ],
      },
      {
        id: 'iso-45001',
        title: 'ISO 45001',
        hours: 8,
        certificate: true,
        paragraphs: [
          'ISO 45001 provides a comprehensive overview of the occupational health and safety management system standard and its integration into organizational operations. This course prepares participants to understand, implement, and maintain an effective OH&S management system that reduces workplace risk, strengthens compliance, and promotes a culture of safety.',
          'Participants gain practical insight into hazard identification, risk assessment, leadership responsibilities, and continual improvement practices necessary to achieve and sustain certification.',
        ],
      },
      {
        id: 'iso-14001',
        title: 'ISO 14001',
        hours: 8,
        certificate: true,
        paragraphs: [
          'ISO 14001 provides a comprehensive overview of the environmental management system standard and its integration within organizational operations. This course prepares participants to understand, implement, and maintain an effective EMS that supports regulatory compliance, environmental stewardship, and sustainable performance.',
          'Participants gain practical insight into identifying environmental aspects and impacts, managing risk, and establishing controls that reduce environmental footprint while strengthening organizational accountability.',
        ],
      },
      {
        id: 'iso-implementation',
        title: 'ISO Implementation',
        topics: [
          'Organizational ISO awareness & implementation training',
          'Documentation development',
          'Internal audit support',
          'Corrective action guidance',
          'Certification preparation',
          'Third-Party Auditing',
        ],
        paragraphs: [
          'APC supports organizations through the full ISO implementation process—from initial training to certification readiness. We begin by training your team on the selected standard and then work alongside your organization to develop documentation, establish processes, and prepare for certification audits.',
          'In some cases, organizations partner with APC to manage and maintain their quality systems through our structured support program.',
        ],
      },
    ],
  },
  {
    id: 'leadership-development',
    title: 'Leadership Development',
    icon: '/images/Icons/Leadership.png',
    accentColor: '#5C6870',
    accentTextColor: '#FFFFFF',
    introText:
      'Our Leadership Development Series is a flexible, modular program designed to cultivate confident, self-aware, and effective leaders at every level. Whether you are a new supervisor or an experienced manager, the series provides practical tools and insights to lead diverse teams, strengthen communication, navigate challenges, and build a high-performance culture. Each session can stand alone or be combined into a customized leadership experience tailored to your organization’s goals.',
    columnItems: [
      { title: 'Benchmarking', itemId: 'benchmarking' },
      { title: 'Customer Service & Effective Communication', itemId: 'customer-service-communication' },
      { title: 'Emotional Intelligence & Difficult Conversations', itemId: 'ei-difficult-conversations' },
      { title: 'Lean Leadership', itemId: 'lean-leadership' },
      { title: 'Myers-Briggs Type Indicator (MBTI)', itemId: 'mbti' },
      { title: 'Negotiation with Employees & Coaching People', itemId: 'negotiation-coaching' },
      { title: 'Team Building & Time Management', itemId: 'team-building-time' },
      { title: 'Training Within Industry (TWI)', itemId: 'twi' },
    ],
    items: [
      {
        id: 'benchmarking',
        title: 'Benchmarking',
        hours: 4,
        certificate: true,
        topics: [
          'Understand benchmarking',
          'Identify performance gaps',
          'Gather and Analyze Data',
          'Set measurable goals',
          'Develop Action Plans',
          'Track and Monitor Performance',
          'Continuous Improvement Strategies',
          'Reporting and Communicating Results',
          'Implement Best Practices',
        ],
        paragraphs: [
          'Discover how to identify best practices, analyze performance gaps, and drive meaningful improvements. This interactive session provides you with practical tools to compare data, set smart goals, and track your success over time. Perfect for teams and leaders looking to elevate results and stay ahead in today’s competitive landscape!',
        ],
      },
      {
        id: 'customer-service-communication',
        title: 'Customer Service & Effective Communication',
        hours: 2,
        certificate: true,
        paragraphs: [
          'Effective Communication equips leaders with practical tools to communicate clearly, confidently, and strategically in the workplace. Participants learn how to reduce misunderstandings, increase engagement, and foster stronger working relationships. The session also explores adapting communication styles to different audiences, active listening techniques, and delivering messages with clarity and impact, helping participants influence others more effectively and navigate workplace challenges with confidence.',
          'Customer Service: Elevate your customer service skills with this comprehensive training. Participants learn to deliver exceptional experiences through effective communication, problem-solving, and empathy. The session equips individuals with practical tools to handle diverse customer needs, resolve concerns professionally, and build loyalty, ultimately enhancing satisfaction in any service-driven role. Participants also explore strategies for managing challenging interactions and creating positive experiences that strengthen long-term relationships.',
        ],
      },
      {
        id: 'ei-difficult-conversations',
        title: 'Emotional Intelligence & Difficult Conversations',
        hours: 2,
        certificate: true,
        paragraphs: [
          'Emotional Intelligence develops the self-awareness and interpersonal skills necessary to lead effectively in dynamic workplace environments. Participants learn to recognize, understand, and manage their own and others’ emotions to strengthen leadership impact and team performance. The session explores how emotional awareness influences communication, decision-making, and conflict resolution. By strengthening these skills, leaders are better equipped to build trust, navigate challenges, and create a more engaged and productive team environment.',
          'Difficult Conversations equips leaders with the confidence and structure to address performance issues, conflict, and sensitive topics constructively. Participants learn how to approach challenging discussions with clarity, professionalism, and accountability. The session focuses on preparing for high-stakes conversations, communicating concerns effectively, and managing emotional responses in a productive way. By developing these skills, leaders can address issues early, strengthen accountability, and maintain positive working relationships.',
        ],
      },
      {
        id: 'lean-leadership',
        title: 'Lean Leadership',
        hours: 8,
        certificate: true,
        topics: [
          'Lean leadership principles',
          'Strategy aligned leadership',
          'Gemba Walk employee engagement',
          'Visual accountability systems',
          'Problem-solving culture',
          'Standardized disciplined execution',
          'Track and Monitor Performance',
          'Continuous Improvement Strategies',
          'Sustain cultural change',
          'Empower problem solvers',
        ],
        paragraphs: [
          'Lean Leadership equips leaders with the mindset, behaviors, and systems necessary to build and sustain a culture of continuous improvement. Rather than managing from a distance, Lean leaders actively engage with teams, remove barriers to performance, and model problem-solving at every level of the organization.',
          'This course focuses on leading with clarity, accountability, and respect for people while driving operational excellence. Lean Leadership pairs especially well with Continuous Improvement initiatives such as Kaizen Events, Lean Manufacturing, Lean Office, or other process improvement efforts to ensure improvements are sustained long-term.',
        ],
      },
      {
        id: 'mbti',
        title: 'Myers-Briggs Type Indicator (MBTI)',
        hours: 4,
        certificate: true,
        topics: [
          'Identify your MBTI personality trait',
          'Recognize strengths and potential blind spots',
          'Understanding the four MBTI dimensions',
          'Adapt communication styles to different personality types',
          'Reduce conflict through greater self-awareness',
        ],
        paragraphs: [
          'This training introduces participants to personality preferences through the Myers-Briggs Type Indicator (MBTI) framework to build greater self-awareness and improve workplace interactions. Participants gain insight into how personality differences influence communication, decision-making, and teamwork. By understanding both their own preferences and those of others, individuals learn how to collaborate more effectively and navigate workplace dynamics with greater confidence. The session also helps participants recognize how diverse personality styles contribute to stronger teams and more effective leadership.',
        ],
      },
      {
        id: 'negotiation-coaching',
        title: 'Negotiation with Employees & Coaching People',
        hours: 2,
        certificate: true,
        paragraphs: [
          'Negotiating with Employees equips leaders with practical strategies to navigate workplace negotiations with confidence and fairness. Whether addressing workload, performance expectations, conflict, or resource allocation, participants learn how to reach mutually beneficial outcomes while maintaining accountability and trust. The session explores how to prepare for negotiations, understand underlying interests, and communicate expectations clearly. By applying structured negotiation techniques, leaders can resolve challenges more effectively while strengthening working relationships.',
          'Coaching People develops leaders’ ability to guide employees toward higher performance through structured, supportive conversations. Participants learn how to move beyond directing and instead develop others through accountability, feedback, and goal alignment. The session focuses on asking effective questions, setting clear expectations, and encouraging ownership of performance and development. By strengthening coaching skills, leaders can build stronger teams, improve engagement, and support long-term employee growth.',
        ],
      },
      {
        id: 'team-building-time',
        title: 'Team Building & Time Management',
        hours: 2,
        certificate: true,
        paragraphs: [
          'Team Building strengthens collaboration, trust, and accountability within work groups. Participants explore the dynamics that influence team performance and learn practical techniques to build alignment, improve communication, and create a high-performing culture. The session examines how roles, expectations, and communication styles affect team effectiveness. By understanding these dynamics, leaders can foster stronger collaboration, resolve challenges more effectively, and create an environment where teams perform at their best.',
          'Time Management equips leaders and professionals with practical strategies to prioritize effectively, reduce distractions, and focus on high-value work. Participants learn to align daily activities with organizational goals, improving productivity and reducing stress. The session explores techniques for setting priorities, managing competing demands, and organizing work more efficiently. By strengthening these skills, participants can improve focus, meet deadlines more consistently, and make better use of their time.',
        ],
      },
      {
        id: 'twi',
        title: 'Training Within Industry (TWI)',
        certificate: true,
        topics: [
          'Job Instruction (JI) — train employees correctly the first time using a structured, step-by-step method',
          'Job Methods (JM) — analyze and improve the way work is performed',
          'Job Relations (JR) — manage people issues proactively and fairly; build trust and morale',
        ],
        paragraphs: [
          'Training Within Industry (TWI) is a proven workforce development system designed to improve productivity, quality, and safety through structured supervisory training. Originally developed to strengthen industrial performance, TWI remains highly relevant across manufacturing, healthcare, service, and administrative environments.',
          'This course introduces the three core TWI modules: Job Instruction, Job Methods, and Job Relations. Each session is customizable to fit your organizational goals and needs. These programs help leaders build practical tools for developing people, improving processes, and strengthening workplace relationships.',
        ],
      },
    ],
  },
  {
    id: 'expanded-services',
    title: 'Expanded Services',
    icon: '/images/Icons/Technology (1).png',
    accentColor: '#4F5552',
    accentTextColor: '#FFFFFF',
    introText:
      'Our Services extend beyond training to provide hands-on implementation and measurable results. Our professional staff works directly alongside your team to plan, execute, and sustain improvement initiatives, ensuring defined goals are achieved before project completion. Services are often paired with training to build internal capability and drive immediate impact. We help organizations move from learning concepts to applying them effectively in real-world settings. Where appropriate, we integrate our student internship program to support implementation efforts, expanding capacity while maintaining quality and accountability.',
    columnItems: [
      { title: 'Additive Manufacturing', itemId: 'additive-manufacturing' },
      { title: 'Artificial Intelligence', itemId: 'artificial-intelligence' },
      { title: 'Internship Program', itemId: 'internship-program' },
      { title: 'Website Design & Marketing', itemId: 'website-design-marketing' },
    ],
    items: [
      {
        id: 'additive-manufacturing',
        title: 'Additive Manufacturing',
        topics: [
          'Product design & development',
          '3D modeling & shop drawings',
          'Bill of material development',
          'Prototype & production 3D printing',
          'Design refinement & iteration',
        ],
        paragraphs: [
          'APC supports product design and additive manufacturing solutions from concept to creation. Whether you have an idea you would like to make a reality or need assistance in refining an existing design, we can develop actionable shop drawings, complete with bills of materials and production-ready files.',
          'We also provide 3D printing services for prototyping and production parts. Our team helps organizations reduce development time, test concepts efficiently, and bring innovations to life.',
        ],
      },
      {
        id: 'artificial-intelligence',
        title: 'Artificial Intelligence',
        topics: [
          'Organizational AI readiness assessment',
          'Process automation opportunities',
          'AI solution identification & integration support',
          'Workflow streamlining',
          'Performance evaluation & refinement',
        ],
        paragraphs: [
          'APC helps organizations assess and implement artificial intelligence solutions that streamline operations and enhance efficiency. We begin with an assessment of your current processes and capabilities, identifying opportunities where AI tools can reduce manual effort and improve performance.',
          'Our approach focuses on practical applications that allow employees to focus more on customer value and less on repetitive tasks.',
        ],
      },
      {
        id: 'internship-program',
        title: 'Internship Program',
        topics: [
          'Project-based internship placement',
          'Professional oversight and structured guidance',
          'Alignment with organizational goals',
          'Measurable deliverables and defined outcomes',
          'Flexible engagement options',
        ],
        paragraphs: [
          'APC’s Internship Program connects organizations with high-performing university students to support real-world projects while developing the next generation of professionals. Interns work under the direct guidance of APC’s experienced staff to ensure quality, accountability, and measurable outcomes.',
          'Organizations gain additional project capacity and fresh perspectives, while students apply classroom knowledge to meaningful business initiatives. Whether supporting continuous improvement efforts, marketing initiatives, website development, quality systems, or technical projects, our internship model delivers value while building workforce readiness. Contact the APC for more information regarding our Student Internship Program.',
        ],
      },
      {
        id: 'website-design-marketing',
        title: 'Website Design & Marketing',
        paragraphs: [
          'Website Design: APC provides website design and development services that enhance functionality, visual appeal, and user experience for both internal and external platforms. Whether building a new site or improving an existing one, we focus on intuitive navigation, clear messaging, and performance optimization to ensure your website supports your organizational goals. We can help with development, redesign, content integration, and ongoing maintenance. Where appropriate, student interns support projects under professional supervision, expanding capacity while maintaining quality and accountability.',
          'Marketing: APC partners with organizations to develop practical, results-driven marketing strategies. We work alongside your team to create content, build structured marketing plans, and develop initiatives that strengthen brand presence and customer engagement. From strategy to execution, our approach ties marketing to your goals. Student interns may support content creation, campaign planning, and analytics under professional oversight.',
        ],
      },
    ],
  },
];

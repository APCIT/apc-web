'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GET_ME_API } from "@/lib/api";

const INTERNSHIP_INFO_URL =
  process.env.NEXT_PUBLIC_INTERNSHIP_INFO_URL ??
  "https://bama365.sharepoint.com/:x:/t/Intern-AlabamaProductivityCenter/ESJD3H41yXVDo8ai2A-XbNYBW7iAJUk7ud0OgaN0DKLydQ?e=eqZPza";

const linkCls = "text-[#666666] font-roboto text-sm whitespace-nowrap";

function PasswordCell({ hasPassword }: { hasPassword: boolean }) {
  return (
    <div className={linkCls}>
      <span className="font-medium">Password:</span>{" "}
      [{" "}
      {hasPassword ? (
        <Link href="/Manage/ChangePassword" className="manage-link">Change password</Link>
      ) : (
        <Link href="/Manage/SetPassword" className="manage-link">Create</Link>
      )}{" "}
      ]
    </div>
  );
}

export default function ManagePage() {
  const searchParams = useSearchParams();
  const [roles, setRoles] = useState<string[]>([]);
  const [hasPassword, setHasPassword] = useState(true);
  const [loading, setLoading] = useState(true);

  const passwordMessage = searchParams.get("message");
  const showPasswordSuccess = passwordMessage === "PasswordChanged" || passwordMessage === "PasswordSet";

  useEffect(() => {
    GET_ME_API().then((res) => {
      if (res.ok) {
        setRoles(res.roles);
        setHasPassword(res.hasPassword);
      }
      setLoading(false);
    });
  }, []);

  const isStaff = roles.includes("staff");
  const isIT = roles.includes("IT");
  const isAdmin = roles.includes("admin");
  const isReception = roles.includes("reception");
  const isAdvisor = roles.includes("advisor");
  const isIntern = roles.includes("intern");

  const staffOrITOrAdmin = isStaff || isIT || isAdmin;
  const staffAndIntern = (isStaff || isIT || isAdmin || isReception) && isIntern;

  /* Show accordion block while loading (so reload doesn't hide content) or when user has a role that sees it. */
  const showAccordionBlock = loading || isStaff || isIT || isAdmin || isIntern;
  /* Staff Files panel only when we know user is staff/IT/admin (not while loading). */
  const showStaffFiles = !loading && (isStaff || isIT || isAdmin);

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        {/* Page Title - black, left */}
        <div className="mb-6">
          <h2 className="text-[30px] font-roboto text-left" style={{ fontWeight: "normal", color: "#000000" }}>
            My Account
          </h2>
        </div>

        {showPasswordSuccess && (
          <p className="mb-4 font-roboto text-sm" style={{ color: "#3c763d" }}>
            Your password has been changed.
          </p>
        )}

        {/* Account Options - role-based link bar (always show; use default layout while loading so reload keeps content) */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mt-8 px-4 w-full">
          {/* Layout 1: Staff/IT/admin/reception + intern → 5 columns */}
          {!loading && staffAndIntern && (
            <>
              <PasswordCell hasPassword={hasPassword} />
              {hasPassword && (
                <>
                  <div className={linkCls}>
                    <span className="font-medium">To-Do List:</span> [ <Link href="/Manage/ToDoList" className="manage-link">To-Do List</Link> ]
                  </div>
                  <div className={linkCls}>
                    <span className="font-medium">Work Schedule:</span> [ <Link href="/Interns/WorkSchedule" className="manage-link">Schedule</Link> ]
                  </div>
                  <div className={linkCls}>
                    <span className="font-medium">Teams Sheets:</span> [ <a href={INTERNSHIP_INFO_URL} className="manage-link" target="_blank" rel="noopener noreferrer">Internship Info</a> ]
                  </div>
                  <div className={linkCls}>
                    <span className="font-medium">Info:</span> [ <Link href="/Manage/EditInfo" className="manage-link">Edit your Information</Link> ]
                  </div>
                </>
              )}
            </>
          )}
          {/* Layout 2: Staff/IT/admin (no intern branch) → 2 columns */}
          {!loading && !staffAndIntern && staffOrITOrAdmin && (
            <>
              <PasswordCell hasPassword={hasPassword} />
              <div className={linkCls}>
                <span className="font-medium">Teams Sheets:</span> [ <a href={INTERNSHIP_INFO_URL} className="manage-link" target="_blank" rel="noopener noreferrer">Internship Info</a> ]
              </div>
            </>
          )}
          {/* Layout 3: Advisor → 1 column */}
          {!loading && !staffAndIntern && !staffOrITOrAdmin && isAdvisor && (
            <PasswordCell hasPassword={hasPassword} />
          )}
          {/* Layout 4: Everyone else (e.g. intern-only) — also default while loading so content stays on reload */}
          {((loading || (!staffAndIntern && !staffOrITOrAdmin && !isAdvisor)) && (
            <>
              <PasswordCell hasPassword={loading ? true : hasPassword} />
              {(loading || hasPassword) && (
                <>
                  <div className={linkCls}>
                    <span className="font-medium">To-Do List:</span> [ <Link href="/Manage/ToDoList" className="manage-link">To-Do List</Link> ]
                  </div>
                  <div className={linkCls}>
                    <span className="font-medium">Work Schedule:</span> [ <Link href="/Interns/WorkSchedule" className="manage-link">Schedule</Link> ]
                  </div>
                  <div className={linkCls}>
                    <span className="font-medium">Info:</span> [ <Link href="/Manage/EditInfo" className="manage-link">Edit your Information</Link> ]
                  </div>
                </>
              )}
            </>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ height: "80px" }} aria-hidden="true" />

        {/* Resources Section + Accordion - only for staff, IT, admin, intern */}
        {showAccordionBlock && (
          <>
            <div className="pl-4 flex flex-col gap-1 mb-8">
              <Link href="/Manage/InternContact" className="text-[#666666] font-roboto text-[17px] font-normal no-underline hover:text-[#666666]">Intern Help Request</Link>
              <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Intern-Handbook-Revision-13-01132025.docx" className="text-[#666666] font-roboto text-[17px] font-normal no-underline hover:text-[#666666]" target="_blank" rel="noopener noreferrer">Intern Handbook</a>
              <a href="https://apcstorage.blob.core.windows.net/active-shooter-info/ActiveShooterFiles.zip" className="text-[#666666] font-roboto text-[17px] font-normal no-underline hover:text-[#666666]" target="_blank" rel="noopener noreferrer">Active Shooter Information</a>
            </div>

            <div style={{ height: "32px" }} aria-hidden="true" />

            <div className="manage-accordion px-4 mt-8">
          <Accordion
            disableIndicatorAnimation={false}
            showDivider={false}
            selectionMode="multiple"
            itemClasses={{
              base: "px-0 shadow-none border border-gray-300 rounded-lg mb-3",
              heading: "m-0 p-0",
              trigger: "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg",
              title: "text-[16px] font-normal text-[#666666] text-left",
              titleWrapper: "flex-1",
              content: "bg-white rounded-lg",
              indicator: "text-black"
            }}
          >
            {/* Intern Work Instructions */}
            <AccordionItem key="1" aria-label="Intern Work Instructions" title="Intern Work Instructions" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <a href="https://apcstorage.blob.core.windows.net/intern-reports/LoggingTimeInstructions.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Time Logging Instructions</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Direct%20Deposit%20Instructions.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Banner Self-Service Direct Deposit Instructions</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Tax-Work-Instructions-for-Interns-01172024.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Tax Work Instructions</a>
              </div>
            </AccordionItem>

            {/* Intern's Required Reports */}
            <AccordionItem key="2" aria-label="Intern's Required Reports" title="Intern's Required Reports" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Impact_Calculator_10312025.xlsx" className="manage-link" target="_blank" rel="noopener noreferrer">Impact Calculator</a>
                <a href="https://apcstorage.blob.core.windows.net/intern-reports/Impacts-Intern-Perspective.pptx" className="manage-link" target="_blank" rel="noopener noreferrer">Helpful Powerpoint for completing the Impact Calculator</a>
                <a href="https://apcstorage.blob.core.windows.net/intern-reports/Sample%20Presentation.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Sample Presentation</a>
              </div>
            </AccordionItem>

            {/* Communication and Time Management */}
            <AccordionItem key="3" aria-label="Communication and Time Management" title="Communication and Time Management" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <h5 className="text-[15px] font-semibold mt-2 mb-1 text-[#333333]">Communication</h5>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/Business%20Etiquette.ppt" className="manage-link" target="_blank" rel="noopener noreferrer">Business Etiquette</a>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/0%20Communication%20Part%201_Personality%20Types.pptx" className="manage-link" target="_blank" rel="noopener noreferrer">Communication Part 1</a>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/1%20Communication%20Part%202.pptx" className="manage-link" target="_blank" rel="noopener noreferrer">Communication Part 2</a>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/Handout%201%20Communicating%20with%20different%20MBTI.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Communicating with different MBTI</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Time Management</h5>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/Assignment%20Prioritization.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Assignment Prioritization</a>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/Getting%20Organized%20Self-assessment.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Getting Organized Self-Assessment</a>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/Priority%20Disruptions%20Tool.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Priority Disruptions</a>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/Time%20Log%20Tool.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Time Log Tool</a>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/Time%20Management%20Assessment.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Time Management Assessment</a>
                <a href="https://apcstorage.blob.core.windows.net/communication-timemangement/Time%20Management.pptx" className="manage-link" target="_blank" rel="noopener noreferrer">Time Management Presentation</a>
              </div>
            </AccordionItem>

            {/* Assessments */}
            <AccordionItem key="4" aria-label="Assessments" title="Assessments" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <a href="https://apcstorage.blob.core.windows.net/handbook/20%20Keys%20Assessment.doc" className="manage-link" target="_blank" rel="noopener noreferrer">20 Keys Assessment</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Factory%20Floor%20Assessment.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Factory Floor Assessment</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/FORD%20ASSESSMENT.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Ford Assessment</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Lean%20Diagnostic.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Lean Diagnostics</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Toyota%20LeanAssessment%20modified.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Toyota Lean Assessment</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/VPMEP%20Supply%20Chain%20Lean%20Assessment%20Updated1.xls" className="manage-link" target="_blank" rel="noopener noreferrer">VPMEP Supply Chain Lean Assessment</a>
              </div>
            </AccordionItem>

            {/* Leadership */}
            <AccordionItem key="5" aria-label="Leadership" title="Leadership" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <a href="https://apcstorage.blob.core.windows.net/handbook/Irrefutable%20Laws%20of%20Leadership%20Part%20I%20(1).pptx" className="manage-link" target="_blank" rel="noopener noreferrer">Irrefutable Laws of Leadership I</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Irrefutable%20Laws%20of%20Leadership%20Part%20I%20(2).pptx" className="manage-link" target="_blank" rel="noopener noreferrer">Irrefutable Laws of Leadership II</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/What%20Companies%20Look%20for%20in%20Future%20Leaders.docx" className="manage-link" target="_blank" rel="noopener noreferrer">What Companies Look for in Future Leaders</a>
              </div>
            </AccordionItem>

            {/* Lean Manufacturing */}
            <AccordionItem key="6" aria-label="Lean Manufacturing" title="Lean Manufacturing" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <h5 className="text-[15px] font-semibold mt-2 mb-1 text-[#333333]">5S</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/5s%20audit.xls" className="manage-link" target="_blank" rel="noopener noreferrer">5S Audit</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/5sdaily%20checklist.xls" className="manage-link" target="_blank" rel="noopener noreferrer">5S Daily Checklist</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/5S_job_aid.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">5S Job Aid</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/2-5S%20%26%20Visual%20Factory.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">5S Visual Factory</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/AOMI%20ASSESSMENT.doc" className="manage-link" target="_blank" rel="noopener noreferrer">AOMI Assessment</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/InitialCleaningPlan.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Initial Cleaning Plan</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/ItemDispositionList.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Item Disposition List</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Team%20Charter_Blank.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Team Charter Blank</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/UnneededItemsLog.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Unneeded Items Log</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/WorkplaceScanChecklist.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Workplace Scan Checklist</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Cellular Flow</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/4-Cellular%20Manufacturing%20v.2.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Cellular Manufacturing</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/stdworkcomb.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Standard Work Combination Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Time%20Obs%20Form.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Time Observation Form</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Work%20Station%20Requirements%20Form.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Work Station Requirements Form</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Kaizen</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/KAIZEN%20CHECK%20LIST.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Checklist</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/1-Kaizen%20Event%20Planning%20Form.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Event Planning Form</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Kaizen%20Event%20Preparation%20Checklist.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Event Preparation Checklist</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/KaizenMilestone.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Milestone</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/KaizenPlanWrkSht.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Plan Worksheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Kaizen%20Report%20Format.ppt" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Report Format</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Kaizen%20Team%20Charter%20Leadership%20Definitions.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Team Charter Leadership Definitions</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/4-kaizen%20time%20observation%20form.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Time Observation Form</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/KaizenWrksht.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Kaizen Worksheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/6-problem%20sheet.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Problem Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Team%20Charter.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Team Charter</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/2-Time%20Observation%20Form.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Time Observation Form</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/95-Value%20Stream%20Map%20Review.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Value Stream Map Review</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/94-VSM%20Plan%20sheet.xls" className="manage-link" target="_blank" rel="noopener noreferrer">VSM Plan Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/8-Work%20Station%20Requirements%20Form.doc" className="manage-link" target="_blank" rel="noopener noreferrer">Work Station Requirements Form</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Kanban</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Copy%20of%20LE206%20Revised%20Pull%20Calculations%20Template82703.xls" className="manage-link" target="_blank" rel="noopener noreferrer">LE206 Pull Calculations Template</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/5-kanban%20v.3.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Kanban</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Pull%20Calculations%20Template.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Pull Calculations Template</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Quick Changeover</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/90-co%20combination%20form.xls" className="manage-link" target="_blank" rel="noopener noreferrer">90-CO Combination Form</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Changeover%20Obs%20Sheet%20BLANK.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Changeover Observation Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Changeover%20Setup%20Sheet%20BLANK.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Changeover Setup Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/QC%20-%20AcmeObsChart.xls" className="manage-link" target="_blank" rel="noopener noreferrer">QC- Acme Observation Chart</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/QC%20-%20Blank%20changeover%20ObsChart.xls" className="manage-link" target="_blank" rel="noopener noreferrer">QC- Blank Changeover Observation Chart</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/3-Quick%20Changeoverv.2.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Quick Changeover</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Standardize Work</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/302_-_Cycle_Time_Bar_Chart_Master.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Cycle Time Bar Chart</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Job%20Breakdown%20Sheet.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Job Breakdown Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/NEW%20SL_SMP%20cleaned.xlsx" className="manage-link" target="_blank" rel="noopener noreferrer">SL_SMP Cleaned</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/NEW%20SL_SMP%20example.xlsm" className="manage-link" target="_blank" rel="noopener noreferrer">SL_SMP Example (xlsm)</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/NEW%20SL_SMP%20example.xlsx" className="manage-link" target="_blank" rel="noopener noreferrer">SL_SMP Example (xlsx)</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/302_-_Standardized_Work_Combination_Sheet_Master.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Standardized Work Combination Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/302_-_Standardized_Work_Layout_Master.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Standardized Work Layout Master</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/302_-_Time_Observation_Form_Master.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Time Observation Form Master</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/302_-_Work_Instruction_Sheet_Master.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Work Instruction Sheet</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Time Measurement</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Job%20Breakdown%20Sheet.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Job Breakdown Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Observed%20Times.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Observed Times</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Standard%20Work%20Combo%20Table.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Standard Work Combination Table</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Time%20Measurement%20Tool.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Time Measurement Tool</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Time%20Observation%20with%20Work%20Content%20Graph.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Time Observation with Work Content Graph</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/2021%20Time%20and%20Motion%20Study%20(1).pptx" className="manage-link" target="_blank" rel="noopener noreferrer">Time and Motion Study</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">TPM</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Time%20Obs%20Form.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Time Observation Form</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/TPM%20-%20Exercise%201.doc" className="manage-link" target="_blank" rel="noopener noreferrer">TPM - Exercise 1</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/TPM%20-%20Exercise%202.doc" className="manage-link" target="_blank" rel="noopener noreferrer">TPM - Exercise 2</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/TPM%20OEE%20Worksheet.xls" className="manage-link" target="_blank" rel="noopener noreferrer">TPM OEE Worksheet</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">VSM</h5>
                <a href="https://apcstorage.blob.core.windows.net/handbook/BlankStoryboard.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Blank Storyboard</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/ContFlowQ-I.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Continuous Flow</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/CStateIcons.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Current State Icons</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/DemandQ-I.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Demand Phase Questions</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/LeanQuestions.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Lean Questions</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/LevelingQ-I.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Leveling Questions</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/MapGuidelines.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Map Guidelines</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/RouteWrksht.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Route Worksheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/StyBrdWorksheet.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Storyboard Worksheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Value%20Stream%20Map%20Review.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Value Stream Map Review</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/6-Value%20Stream%20Mapping%20v.2.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Value Stream Mapping</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/VSMIcons.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">VSM Icons</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/VSM%20Intern%20Orientation%20.ppt" className="manage-link" target="_blank" rel="noopener noreferrer">VSM Intern Orientation</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/VSM%20Plan%20sheet.xls" className="manage-link" target="_blank" rel="noopener noreferrer">VSM Plan Sheet</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/VSM%20Sheet%2011%20by%2017.ppt" className="manage-link" target="_blank" rel="noopener noreferrer">VSM Sheet 11x17</a>
              </div>
            </AccordionItem>

            {/* Payroll */}
            <AccordionItem key="7" aria-label="Payroll" title="Payroll" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/2026_APC_Internship_Calendar.xlsx" className="manage-link" target="_blank" rel="noopener noreferrer">2026 Payroll Calendar</a>
              </div>
            </AccordionItem>

            {/* Presentations */}
            <AccordionItem key="8" aria-label="Presentations" title="Presentations" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <a href="https://apcstorage.blob.core.windows.net/handbook/PPT%20Presentation%20Training.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">PPT Presentation Training</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Sample%20Presentation.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Sample Presentation</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/APC.Student.Poster.template.pub" className="manage-link" target="_blank" rel="noopener noreferrer">Student Poster Template</a>
              </div>
            </AccordionItem>

            {/* Problem Solving */}
            <AccordionItem key="9" aria-label="Problem Solving" title="Problem Solving" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <a href="https://apcstorage.blob.core.windows.net/handbook/5Why%20.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">5 Why</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Practical%20Problem%20Solving%20v1.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Practical Problem Solving</a>
                <a href="https://apcstorage.blob.core.windows.net/handbook/Problem%20Solving.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Problem Solving</a>
              </div>
            </AccordionItem>

            {/* Video Instructions */}
            <AccordionItem key="10" aria-label="Video Instructions" title="Video Instructions" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-[#666666] font-roboto">How To Log Time (embedded video)</p>
                <p className="text-sm text-[#666666] font-roboto">How to Set Up Direct Deposit (embedded video)</p>
              </div>
            </AccordionItem>

            {/* Staff Files - only for staff, IT, admin */}
            {showStaffFiles && (
            <AccordionItem key="11" aria-label="Staff Files" title="Staff Files" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <h5 className="text-[15px] font-semibold mt-2 mb-1 text-[#333333]">Proposals</h5>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Internship-Proposal-Rev-18-22625.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Proposal for Internship Program</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Professional-Services-Proposal-Rev-11-22625.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Proposal for Professional Services</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Proposal-Calculator-1.15.2026.xlsx" className="manage-link" target="_blank" rel="noopener noreferrer">Proposal Calculator</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Staff Materials</h5>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Service%20Log%20Instructions.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Service Log Instructions</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Staff Surveys</h5>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Work_Schedules_Fall_2018%20(1).qsf" className="manage-link" target="_blank" rel="noopener noreferrer">Schedule Survey</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">One Drive</h5>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/One%20Drive%20Collaboration%20Instructions%20(1).docx" className="manage-link" target="_blank" rel="noopener noreferrer">One Drive Instructions</a>
                
                <h5 className="text-[15px] font-semibold mt-4 mb-1 text-[#333333]">Intern Hiring Documents</h5>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Undergraduate-New-Hire-Documents-Checklist-Revision-19-08242023.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Undergraduate New Hire Checklist</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Confidentiality-Statement-for-Student-Employees-updated-2013-1.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">CCB Confidential Agreement</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Graduate-New-Hire-Documents-Checklist-Revision-10-08252023.xls" className="manage-link" target="_blank" rel="noopener noreferrer">Graduate New Hire Checklist</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Letter-of-Intent-for-Non-UA-students-Revision-11-22625.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Offer Letter for Non-UA students</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Offer-Letter-for-UA-Student-Revision-20-22625.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Letter for UA students</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Return-Student-Offer-Letter-Revision-5-2212024.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Return Student Offer Letter</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Handbook-Compliance-Highlights-Revision-3-0825223.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Handbook Compliance Document</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Aknowledgement-of-Understanding-and-Receipt-of-Handbook-Rev-3-41223.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Handbook Acknowledgement</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/New-Health-Insurance-Marketplace-CoverageOptions-and-Your-Health-Coverage.pdf" className="manage-link" target="_blank" rel="noopener noreferrer">Health Insurance Information</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Interview-Questionnaire-Revision-9-03242025.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Interview Questionnaire</a>
              </div>
            </AccordionItem>
            )}

            {/* Interview Tips */}
            <AccordionItem key="12" aria-label="Interview Tips" title="Interview Tips" HeadingComponent="div">
              <div className="flex flex-col gap-3">
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Interview Tips for In Person Interviews.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Interview Tips for In Person Interviews</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Interview Tips for Virtual Interviews.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Interview Tips for Virtual Interviews</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Interviewee.Questions.for.Interns.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Interview Questions for Interns</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/STAR-Method-Updated-02272025.docx" className="manage-link" target="_blank" rel="noopener noreferrer">STAR Method</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Additional.Interviewee.Questions.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Additional Interview Questions</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Behavioral.Analytical.Team.Focused.Interview.Questions.docx" className="manage-link" target="_blank" rel="noopener noreferrer">Behavioral Analytical Team Focused Interview</a>
                <a href="https://apcstorage.blob.core.windows.net/staff-only-materials/Resume_Building.pptx" className="manage-link" target="_blank" rel="noopener noreferrer">Resume Optimization</a>
              </div>
            </AccordionItem>
          </Accordion>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

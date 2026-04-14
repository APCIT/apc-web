"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type TitleRule = {
  test: RegExp;
  title: string;
};

const TITLE_RULES: TitleRule[] = [
  { test: /^\/$/, title: "Home - APC" },
  { test: /^\/Home$/, title: "Home - APC" },
  { test: /^\/Home\/Index$/, title: "Home - APC" },
  { test: /^\/Home\/About$/, title: "About Us - APC" },
  { test: /^\/Home\/Services$/, title: "Client Services - APC" },
  { test: /^\/Home\/ExpandedServices$/, title: "Services Details - APC" },
  { test: /^\/Home\/Internships$/, title: "Internship Application - APC" },
  { test: /^\/Apply$/, title: "Internship Application - APC" },
  { test: /^\/Home\/Apply$/, title: "Internship Application - APC" },
  { test: /^\/Home\/Jobs$/, title: "Jobs - APC" },
  { test: /^\/Home\/Newsletters$/, title: "News - APC" },
  { test: /^\/Home\/PastNewsletters$/, title: "PastNewsletters - APC" },
  { test: /^\/Home\/SuccessStories$/, title: "Success Stories - APC" },
  { test: /^\/Home\/Locations$/, title: "Locations - APC" },
  { test: /^\/Home\/Classes$/, title: "Class Registration - APC" },
  { test: /^\/Home\/Thankyou$/, title: "Thank You - APC" },
  { test: /^\/Apply\/Thankyou$/, title: "Thank You - APC" },
  { test: /^\/Account\/Login$/, title: "Log In - APC" },
  { test: /^\/Account\/ResetPassword$/, title: "Reset Password - APC" },
  {
    test: /^\/Account\/ResetPasswordConfirmation$/,
    title: "Reset password confirmation - APC",
  },
  { test: /^\/Account\/Unauthorized$/, title: "Unauthorized - APC" },
  { test: /^\/Manage$/, title: "My Account - APC" },
  { test: /^\/Manage\/Index$/, title: "My Account - APC" },
  { test: /^\/Manage\/Users$/, title: "Users - APC" },
  { test: /^\/Manage\/ToDoList$/, title: "To-Do List - APC" },
  { test: /^\/Manage\/InternContact$/, title: "Help Request Form - APC" },
  { test: /^\/Manage\/EditInfo$/, title: "Edit Information - APC" },
  { test: /^\/Manage\/ChangePassword$/, title: "Change Password - APC" },
  { test: /^\/Manage\/AssignRoles\/[^/]+$/, title: "Assign Roles - APC" },
  { test: /^\/Manage\/CreateNewUser$/, title: "Create New User - APC" },
  { test: /^\/Manage\/Users\/CreateNewUser$/, title: "Create New User - APC" },
  { test: /^\/Interns$/, title: "Interns - APC" },
  { test: /^\/Interns\/Index$/, title: "Interns - APC" },
  { test: /^\/Interns\/Details\/[^/]+$/, title: "Intern Details - APC" },
  { test: /^\/Interns\/WorkSchedule\/[^/]+$/, title: "Work Schedule - APC" },
  { test: /^\/Interns\/ScheduleDisplay$/, title: "Schedule Display - APC" },
  { test: /^\/Interns\/ReturningIntern\/[^/]+$/, title: "Returning Intern - APC" },
  { test: /^\/Interns\/Reapply$/, title: "Re-Apply - APC" },
  { test: /^\/Interns\/Thankyou$/, title: "Thank You - APC" },
  {
    test: /^\/Interns\/InternsWithoutReports$/,
    title: "Interns Without Reports - APC",
  },
  { test: /^\/PastInterns$/, title: "Past Interns - APC" },
  { test: /^\/PastInterns\/Index$/, title: "Past Interns - APC" },
  {
    test: /^\/PastInterns\/PastInternsDetails\/[^/]+$/,
    title: "Past Intern Details - APC",
  },
  { test: /^\/PastInterns\/Details\/[^/]+$/, title: "Past Intern Details - APC" },
  { test: /^\/Applicants$/, title: "Applicants - APC" },
  { test: /^\/Applicants\/Index$/, title: "Applicants - APC" },
  { test: /^\/Applicants\/Details\/[^/]+$/, title: "Applicant Details - APC" },
  { test: /^\/Applicants\/Edit\/[^/]+$/, title: "Edit Applicant - APC" },
  { test: /^\/Applicants\/Search$/, title: "Search Applicants - APC" },
  { test: /^\/Applicants\/SearchResults$/, title: "Search Results - APC" },
  { test: /^\/Companies$/, title: "Companies - APC" },
  { test: /^\/Companies\/Create$/, title: "Create Company - APC" },
  { test: /^\/Companies\/Edit\/[^/]+$/, title: "Edit Company - APC" },
  { test: /^\/Services$/, title: "Services Log - APC" },
  { test: /^\/Services\/Details\/[^/]+$/, title: "Project Details - APC" },
  { test: /^\/Services\/Create$/, title: "Create Project - APC" },
  { test: /^\/Services\/Edit\/[^/]+$/, title: "Edit Project - APC" },
  { test: /^\/Services\/Delete\/[^/]+$/, title: "Delete Service Record - APC" },
  { test: /^\/Time$/, title: "Log Time - APC" },
  { test: /^\/Time\/Index\/[^/]+$/, title: "Log Time - APC" },
  { test: /^\/Time\/Create\/[^/]+$/, title: "Create Timelog - APC" },
  { test: /^\/Time\/Edit\/[^/]+$/, title: "Edit Timelog - APC" },
  { test: /^\/Classes\/Registrants$/, title: "Registrants - APC" },
  { test: /^\/Charts$/, title: "Charts - APC" },
  { test: /^\/Charts\/Index$/, title: "Charts - APC" },
  { test: /^\/Presentations$/, title: "Presentations - APC" },
  { test: /^\/Presentations\/Index$/, title: "Presentations - APC" },
  { test: /^\/TestFeatures\/IframeTest$/, title: "Iframe Test - APC" },
];

function getTitle(pathname: string): string {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  const match = TITLE_RULES.find((rule) => rule.test.test(cleanPath));
  return match?.title ?? "APC";
}

export default function RouteTitle() {
  const pathname = usePathname();

  useEffect(() => {
    document.title = getTitle(pathname);
  }, [pathname]);

  return null;
}

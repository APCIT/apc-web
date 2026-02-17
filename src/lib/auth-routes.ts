/**
 * Central config: which paths require which roles.
 * Mirrors Navbar getMenuLinksForRoles so the same roles that see a link can access that path.
 * null = any authenticated user. First matching rule wins (more specific paths first).
 */
const ROUTE_ROLES: { path: string; roles: string[] | null; exact?: boolean }[] = [
  // Manage/Users — IT, admin only (staff does not get Users link)
  { path: "/Manage/Users", roles: ["admin", "IT"], exact: true },
  // Manage/ToDoList — intern only
  { path: "/Manage/ToDoList", roles: ["intern"], exact: false },
  // Interns sub-routes before /Interns
  { path: "/Interns/ScheduleDisplay", roles: ["IT", "admin", "staff"], exact: false },
  { path: "/Interns/WorkSchedule", roles: ["intern"], exact: false },
  // IT, admin, staff (no Users for staff, no Charts/reception/advisor for reception/advisor)
  { path: "/Charts", roles: ["IT", "admin", "staff"], exact: false },
  { path: "/Applicants", roles: ["IT", "admin", "staff", "reception"], exact: false },
  { path: "/Interns", roles: ["IT", "admin", "staff", "reception", "client", "accountant"], exact: false },
  { path: "/PastInterns", roles: ["IT", "admin", "staff", "reception"], exact: false },
  { path: "/Presentations", roles: ["IT", "admin", "staff", "advisor", "reception"], exact: false },
  { path: "/Classes/Registrants", roles: ["IT", "admin", "staff", "reception"], exact: false },
  { path: "/Companies", roles: ["IT", "admin", "staff", "reception"], exact: false },
  { path: "/Services", roles: ["IT", "admin", "staff", "reception"], exact: false },
  // My Account — everyone
  { path: "/Manage", roles: null, exact: false },
  // Log Time — intern only
  { path: "/Time", roles: ["intern"], exact: false },
];

/**
 * Returns the list of roles allowed to access this path, or null if any authenticated user may access.
 */
export function getAllowedRolesForPath(pathname: string): string[] | null {
  const normalized = pathname.replace(/\/$/, "") || "/";
  for (const { path, roles, exact } of ROUTE_ROLES) {
    const matches = exact
      ? normalized === path
      : normalized === path || normalized.startsWith(path + "/");
    if (matches) return roles;
  }
  return null;
}

/**
 * Returns true if the user (with the given roles) is allowed to access the path.
 */
export function canAccessPath(pathname: string, userRoles: string[] = []): boolean {
  const allowed = getAllowedRolesForPath(pathname);
  if (allowed === null) return true;
  return allowed.some((role) => userRoles.includes(role));
}

'use client';
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { useState, useEffect } from "react";
import { GET_ME_API, LOGOUT_API } from "@/lib/api";

type MenuLink = { key: string; label: string; href: string };

function getMenuLinksForRoles(roles: string[]): MenuLink[] {
  const r = (name: string) => roles.includes(name);
  const links: MenuLink[] = [];
  const add = (key: string, label: string, href: string) => {
    if (!links.some((l) => l.key === key)) links.push({ key, label, href });
  };

  // My Account — everyone
  add("manage", "My Account", "/Manage");

  if (r("intern")) {
    add("time", "Log Time", "/Time");
    add("work-schedule", "Work Schedule", "/Interns/WorkSchedule");
    add("todo", "To-Do List", "/Manage/ToDoList");
  }
  if (r("IT")) {
    add("applicants", "Applicants", "/Applicants");
    add("interns", "Interns", "/Interns");
    add("schedule-display", "Intern Schedules", "/Interns/ScheduleDisplay");
    add("past-interns", "Past Interns", "/PastInterns");
    add("client-timelogs", "Client Timelogs", "/ClientTimelogs");
    add("presentations", "Presentations", "/Presentations");
    add("charts", "Charts", "/Charts");
    add("registrants", "Class Registrants", "/Classes/Registrants");
    add("companies", "Companies", "/Companies");
    add("services", "Professional Services", "/Services");
    add("users", "Users", "/Manage/Users");
  }
  if (r("admin") && !r("IT")) {
    add("applicants", "Applicants", "/Applicants");
    add("interns", "Interns", "/Interns");
    add("schedule-display", "Intern Schedules", "/Interns/ScheduleDisplay");
    add("past-interns", "Past Interns", "/PastInterns");
    add("client-timelogs", "Client Timelogs", "/ClientTimelogs");
    add("presentations", "Presentations", "/Presentations");
    add("charts", "Charts", "/Charts");
    add("registrants", "Class Registrants", "/Classes/Registrants");
    add("companies", "Companies", "/Companies");
    add("services", "Professional Services", "/Services");
    add("users", "Users", "/Manage/Users");
  }
  if (r("staff") && !r("IT") && !r("admin")) {
    add("applicants", "Applicants", "/Applicants");
    add("interns", "Interns", "/Interns");
    add("schedule-display", "Intern Schedules", "/Interns/ScheduleDisplay");
    add("past-interns", "Past Interns", "/PastInterns");
    add("client-timelogs", "Client Timelogs", "/ClientTimelogs");
    add("presentations", "Presentations", "/Presentations");
    add("charts", "Charts", "/Charts");
    add("registrants", "Class Registrants", "/Classes/Registrants");
    add("companies", "Companies", "/Companies");
    add("services", "Professional Services", "/Services");
  }
  if (r("reception") && !r("IT") && !r("admin") && !r("staff")) {
    add("interns", "Interns", "/Interns");
    add("applicants", "Applicants", "/Applicants");
    add("past-interns", "Past Interns", "/PastInterns");
    add("presentations", "Presentations", "/Presentations");
    add("registrants", "Class Registrants", "/Classes/Registrants");
    add("companies", "Companies", "/Companies");
    add("services", "Professional Services", "/Services");
  }
  if (r("advisor") && !r("IT") && !r("admin") && !r("staff")) {
    add("presentations", "Presentations", "/Presentations");
  }
  // Temporarily hide Interns for clients — restore with auth-routes / API roles when ready
  // if (r("client") && !r("IT") && !r("admin") && !r("staff") && !r("reception")) {
  //   add("interns", "Interns", "/Interns");
  // }
  if (r("accountant") && !r("IT") && !r("admin") && !r("staff") && !r("reception")) {
    add("interns", "Interns", "/Interns");
  }
  return links;
}

const CaretSvg = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="transition-transform duration-300"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      width: "16px",
      height: "16px",
    }}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

type NavbarProps = {
  initialUser?: { userName: string } | null;
  initialRoles?: string[];
};

export default function Navbar({ initialUser = null, initialRoles = [] }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSuccessStoriesOpen, setIsSuccessStoriesOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"main" | "account">("main");
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isMobileSuccessStoriesOpen, setIsMobileSuccessStoriesOpen] = useState(false);
  const [user, setUser] = useState<{ userName: string } | null>(initialUser ?? null);
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>(() => getMenuLinksForRoles(initialRoles ?? []));

  useEffect(() => {
    GET_ME_API().then((res) => {
      if (res.ok) {
        setUser(res.user);
        setMenuLinks(getMenuLinksForRoles(res.roles));
      } else {
        setUser(null);
        setMenuLinks([]);
      }
    });
  }, [pathname]);

  const resetMobileNavState = () => {
    setMobilePanel("main");
    setIsMobileAboutOpen(false);
    setIsMobileSuccessStoriesOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    resetMobileNavState();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => {
      if (open) resetMobileNavState();
      return !open;
    });
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mobilePanel === "account") {
        setMobilePanel("main");
        return;
      }
      closeMobileMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen, mobilePanel]);

  // Lock background scroll while the mobile menu is open (iOS Safari-safe)
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
      width: body.style.width,
      htmlOverflow: documentElement.style.overflow,
    };
    body.classList.add("mobile-nav-locked");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    return () => {
      body.classList.remove("mobile-nav-locked");
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      documentElement.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isMobileMenuOpen]);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMobileMenu();

    // If we're on the home page, just scroll
    if (pathname === "/") {
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Navigate to home page, then scroll
      router.push("/");
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLElement>, href: string, sectionId: string) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    closeMobileMenu();

    const targetPath = href.split("#")[0];
    const navbarHeight = 100; // Height of the fixed navbar
    const extraPadding = 20; // Extra padding for visual clearance

    const scrollToSection = () => {
      const section = document.getElementById(sectionId);
      if (section) {
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - extraPadding;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    };

    // If we're on the target page, just scroll
    if (pathname === targetPath) {
      setTimeout(() => {
        scrollToSection();
      }, 100);
    } else {
      // Navigate to page, then scroll
      router.push(targetPath);
      setTimeout(() => {
        scrollToSection();
      }, 500);
    }
  };

  return (
    <header className="sticky inset-x-0 top-0 z-[1030] w-full bg-[#4A4C54] border-b border-[#35363B] transition-[background,padding] duration-500 ease-in-out">
      <nav className="mx-auto flex h-[96px] w-full max-w-[77rem] items-center gap-3 px-4" aria-label="Primary">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 pl-2">
            <Image
              src="/images/APCLogoDark.png"
              alt="APC Logo"
              width={135}
              height={84}
              className="w-auto h-[65px] object-contain"
              priority
              quality={100}
            />
          </Link>
        </div>

        {/* Hamburger Button - Mobile Only */}
        <button
          type="button"
          className="navbar-hamburger"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} aria-hidden="true"></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} aria-hidden="true"></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} aria-hidden="true"></span>
        </button>

        {/* Desktop Navigation */}
        <ul className="navbar-desktop-menu flex items-center list-none mx-auto flex-nowrap" style={{fontFamily: 'var(--font-sans)'}}>
          <NavItem href="/">Home</NavItem>
          <li className="leading-none list-none">
            <Dropdown 
              classNames={{
                content: "bg-white p-0 border-0 shadow-lg min-w-[160px] overflow-hidden",
              }}
              onOpenChange={(open) => setIsAboutOpen(open)}
            >
              <DropdownTrigger>
                <button
                  type="button"
                  className="nav-link block whitespace-nowrap rounded px-[10px] py-[8px] font-normal text-white hover:text-white/80 no-underline !text-white cursor-pointer bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 border-0 flex items-center gap-2"
                  style={{color: 'white', fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '400', letterSpacing: '0', backgroundColor: 'transparent', boxShadow: 'none'}}
                >
                  About
                  <CaretSvg open={isAboutOpen} />
                </button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="About menu"
                className="p-0 bg-white"
                itemClasses={{
                  base: "dropdown-item text-black data-[hover=true]:bg-transparent rounded-none px-4 py-[3px] m-0 text-center justify-center relative",
                }}
              >
                <DropdownItem 
                  key="about-us"
                  as={Link}
                  href="/Home/About"
                  style={{fontSize: '1rem', lineHeight: '1.35', fontWeight: '400'}}
                >
                  About Us
                </DropdownItem>
                <DropdownItem 
                  key="staff"
                  onClick={(e) => handleSectionClick(e as React.MouseEvent<HTMLElement>, "/Home/About#StaffSectionLoc", "StaffSectionLoc")}
                  style={{fontSize: '1rem', lineHeight: '1.35', fontWeight: '400', cursor: 'pointer'}}
                >
                  Staff Directory
                </DropdownItem>
                <DropdownItem 
                  key="board"
                  onClick={(e) => handleSectionClick(e as React.MouseEvent<HTMLElement>, "/Home/About#BoardSectionLoc", "BoardSectionLoc")}
                  style={{fontSize: '1rem', lineHeight: '1.35', fontWeight: '400', cursor: 'pointer'}}
                >
                  Board Directory
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          <NavItem href="/Home/Internships">Internships</NavItem>
          <NavItem href="/Apply">Apply</NavItem>
          <NavItem href="/Home/Services">Professional Services</NavItem>

          <li className="leading-none list-none">
            <Dropdown
              classNames={{
                content:
                  "bg-white p-0 border-0 shadow-lg min-w-[180px] overflow-hidden",
              }}
              onOpenChange={(open) => setIsSuccessStoriesOpen(open)}
            >
              <DropdownTrigger>
                <button
                  type="button"
                  className="nav-link block whitespace-nowrap rounded px-[10px] py-[8px] font-normal text-white hover:text-white/80 no-underline !text-white cursor-pointer bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 border-0 flex items-center gap-2"
                  style={{
                    color: "white",
                    fontSize: "1rem",
                    lineHeight: "1.5rem",
                    fontWeight: "400",
                    letterSpacing: "0",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  }}
                >
                  Success Stories
                  <CaretSvg open={isSuccessStoriesOpen} />
                </button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Success Stories menu"
                className="p-0 bg-white"
                itemClasses={{
                  base: "dropdown-item text-black data-[hover=true]:bg-transparent rounded-none px-4 py-[3px] m-0 text-center justify-center relative",
                }}
              >
                <DropdownItem
                  key="success-stories"
                  as={Link}
                  href="/Home/SuccessStories"
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.35",
                    fontWeight: "400",
                  }}
                >
                  Success Stories
                </DropdownItem>

                <DropdownItem
                  key="intern-spotlights"
                  as={Link}
                  href="/Home/InternSpotlights"
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.35",
                    fontWeight: "400",
                  }}
                >
                  Intern Spotlights
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
                    <NavItem href="/Home/Locations">Locations</NavItem>
          <NavItem href="/Home/Newsletters">News</NavItem>
          <li className="leading-none list-none">
          <Link
              href="/Home/Contact"
              className="nav-link flex whitespace-nowrap items-center justify-center rounded px-[10px] py-[8px] font-normal text-white hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 no-underline !text-white cursor-pointer"
              style={{ color: 'white', fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '300' }}
              >
            Contact
        </Link>
          </li>
        </ul>
        <ul className="navbar-desktop-login flex items-center list-none mr-[5px]" style={{fontFamily: 'var(--font-sans)', marginTop: '0.5%'}}>
          <li className="list-none">
            {user ? (
              <Dropdown
                placement="bottom-end"
                classNames={{
                  content: "bg-white p-0 border-0 shadow-lg min-w-[180px] overflow-hidden",
                }}
                onOpenChange={(open) => setIsUserOpen(open)}
              >
                <DropdownTrigger>
                  <button
                    type="button"
                    className="nav-link block rounded px-[10px] py-[8px] font-normal text-white hover:text-white/80 no-underline !text-white cursor-pointer bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 border-0 flex items-center gap-2"
                    style={{ color: "white", fontSize: "1rem", lineHeight: "50px", fontWeight: "300", backgroundColor: "transparent", boxShadow: "none" }}
                  >
                    {user.userName}
                    <CaretSvg open={isUserOpen} />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="User menu"
                  className="p-0 bg-white"
                  itemClasses={{
                    base: "dropdown-item text-black data-[hover=true]:bg-transparent rounded-none px-4 py-[3px] m-0 text-center justify-center relative",
                  }}
                >
                  {[
                    ...menuLinks.map((item) => (
                      <DropdownItem
                        key={item.key}
                        as={Link}
                        href={item.href}
                        style={{ fontSize: "1rem", lineHeight: "1.35", fontWeight: "300" }}
                      >
                        {item.label}
                      </DropdownItem>
                    )),
                    <DropdownItem
                      key="logout"
                      style={{ fontSize: "1rem", lineHeight: "1.35", fontWeight: "300", cursor: "pointer" }}
                      onPress={async () => {
                        await LOGOUT_API();
                        setUser(null);
                        setMenuLinks([]);
                        router.push("/");
                        router.refresh();
                      }}
                    >
                      Log Out
                    </DropdownItem>,
                  ]}
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Link
                href="/Account/Login"
                id="loginLink"
                className="nav-link block whitespace-nowrap px-[15px] py-[8px] font-normal text-white hover:text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 no-underline !text-white"
                style={{ color: "white", fontSize: "1rem", lineHeight: "50px", fontWeight: "300" }}
              >
                Log In
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile Menu — inline panels (no HeroUI portals; Safari-safe) */}
        <div
          id="mobile-nav"
          className={`navbar-mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
          aria-hidden={!isMobileMenuOpen}
          inert={!isMobileMenuOpen ? true : undefined}
        >
          {mobilePanel === "account" && user ? (
            <ul className="mobile-nav-list" style={{ fontFamily: "var(--font-sans)" }}>
              <li className="mobile-account-header">
                <button
                  type="button"
                  className="mobile-dropdown-trigger mobile-back-btn"
                  onClick={() => setMobilePanel("main")}
                  aria-label="Back to main menu"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Back</span>
                </button>
                <div className="mobile-account-heading" aria-hidden="true">
                  {user.userName}
                </div>
              </li>
              {menuLinks.map((item) => (
                <li key={`mobile-account-${item.key}`}>
                  <Link href={item.href} onClick={closeMobileMenu}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="mobile-dropdown-trigger"
                  onClick={async () => {
                    await LOGOUT_API();
                    setUser(null);
                    setMenuLinks([]);
                    closeMobileMenu();
                    router.push("/");
                    router.refresh();
                  }}
                >
                  Log Out
                </button>
              </li>
            </ul>
          ) : (
            <ul className="mobile-nav-list" style={{ fontFamily: "var(--font-sans)" }}>
              <li>
                <Link href="/" onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li className="mobile-accordion">
                <button
                  type="button"
                  className="mobile-dropdown-trigger"
                  aria-expanded={isMobileAboutOpen}
                  onClick={() => setIsMobileAboutOpen((o) => !o)}
                >
                  About
                  <CaretSvg open={isMobileAboutOpen} />
                </button>
                {isMobileAboutOpen && (
                  <ul className="mobile-accordion-panel">
                    <li>
                      <Link href="/Home/About" onClick={closeMobileMenu}>
                        About Us
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="mobile-dropdown-trigger"
                        onClick={(e) => {
                          handleSectionClick(
                            e as React.MouseEvent<HTMLElement>,
                            "/Home/About#StaffSectionLoc",
                            "StaffSectionLoc"
                          );
                        }}
                      >
                        Staff Directory
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="mobile-dropdown-trigger"
                        onClick={(e) => {
                          handleSectionClick(
                            e as React.MouseEvent<HTMLElement>,
                            "/Home/About#BoardSectionLoc",
                            "BoardSectionLoc"
                          );
                        }}
                      >
                        Board Directory
                      </button>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link href="/Home/Internships" onClick={closeMobileMenu}>
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/Apply" onClick={closeMobileMenu}>
                  Apply
                </Link>
              </li>
              <li>
                <Link href="/Home/Services" onClick={closeMobileMenu}>
                  Professional Services
                </Link>
              </li>
              <li className="mobile-accordion">
                <button
                  type="button"
                  className="mobile-dropdown-trigger"
                  aria-expanded={isMobileSuccessStoriesOpen}
                  onClick={() => setIsMobileSuccessStoriesOpen((o) => !o)}
                >
                  Success Stories
                  <CaretSvg open={isMobileSuccessStoriesOpen} />
                </button>
                {isMobileSuccessStoriesOpen && (
                  <ul className="mobile-accordion-panel">
                    <li>
                      <Link href="/Home/SuccessStories" onClick={closeMobileMenu}>
                        Success Stories
                      </Link>
                    </li>
                    <li>
                      <Link href="/Home/InternSpotlights" onClick={closeMobileMenu}>
                        Intern Spotlights
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link href="/Home/Locations" onClick={closeMobileMenu}>
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/Home/Newsletters" onClick={closeMobileMenu}>
                  News
                </Link>
              </li>
              <li>
                <a href="#contact" onClick={handleContactClick}>
                  Contact
                </a>
              </li>
              <li>
                {user ? (
                  <button
                    type="button"
                    className="mobile-dropdown-trigger"
                    aria-haspopup="true"
                    onClick={() => setMobilePanel("account")}
                  >
                    {user.userName}
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link href="/Account/Login" onClick={closeMobileMenu}>
                    Log In
                  </Link>
                )}
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return(
    <li className="leading-none list-none">
        <Link
          href={href}
          className="nav-link block whitespace-nowrap rounded px-[10px] py-[8px] font-normal text-white hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 no-underline !text-white"
          style={{color: 'white', fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '400'}}
        >
        { children }
      </Link>
    </li>
  );
}
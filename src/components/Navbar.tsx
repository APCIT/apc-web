'use client';
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Close mobile menu first
    setIsMobileMenuOpen(false);
    
    // If we're on the home page, just scroll
    if (pathname === '/') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Navigate to home page, then scroll
      router.push('/');
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLElement>, href: string, sectionId: string) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    // Close mobile menu first
    setIsMobileMenuOpen(false);
    
    const targetPath = href.split('#')[0];
    const navbarHeight = 100; // Height of the fixed navbar
    const extraPadding = 20; // Extra padding for visual clearance
    
    const scrollToSection = () => {
      const section = document.getElementById(sectionId);
      if (section) {
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - extraPadding;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
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
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[1030] w-full bg-[#3d3d3d] border-b border-[#2a2a2a] transition-[background,padding] duration-500 ease-in-out">
      <nav className="mx-auto flex h-[100px] w-full max-w-7xl items-center px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 pl-2">
            <Image
              src="/images/APCLogoDark.png"
              alt="APC Logo"
              width={160}
              height={100}
              className="w-auto h-[100px] object-contain"
              priority
              quality={100}
            />
          </Link>
        </div>

        {/* Hamburger Button - Mobile Only */}
        <button
          className="navbar-hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Desktop Navigation */}
        <ul className="navbar-desktop-menu flex items-center list-none mx-auto" style={{fontFamily: 'var(--font-sans)'}}>
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
                  className="nav-link block rounded px-[15px] py-[8px] font-normal text-white hover:text-white/80 no-underline !text-white cursor-pointer bg-transparent outline-none focus:outline-none focus-visible:outline-none border-0 flex items-center gap-2"
                  style={{color: 'white', fontSize: '18px', lineHeight: '50px', fontWeight: '400', backgroundColor: 'transparent', boxShadow: 'none'}}
                >
                  About
                  <svg
                    className="transition-transform duration-300"
                    style={{
                      transform: isAboutOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      width: '16px',
                      height: '16px',
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
                </button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="About menu"
                className="p-0 bg-white"
                itemClasses={{
                  base: "dropdown-item text-black data-[hover=true]:bg-transparent rounded-none px-4 m-0 text-center justify-center relative",
                }}
              >
                <DropdownItem 
                  key="about-us"
                  as={Link}
                  href="/Home/About"
                  style={{fontSize: '18px', lineHeight: '50px', fontWeight: '400'}}
                >
                  About Us
                </DropdownItem>
                <DropdownItem 
                  key="staff"
                  onClick={(e) => handleSectionClick(e as React.MouseEvent<HTMLElement>, "/Home/About#StaffSectionLoc", "StaffSectionLoc")}
                  style={{fontSize: '18px', lineHeight: '50px', fontWeight: '400', cursor: 'pointer'}}
                >
                  Staff Directory
                </DropdownItem>
                <DropdownItem 
                  key="board"
                  onClick={(e) => handleSectionClick(e as React.MouseEvent<HTMLElement>, "/Home/About#BoardSectionLoc", "BoardSectionLoc")}
                  style={{fontSize: '18px', lineHeight: '50px', fontWeight: '400', cursor: 'pointer'}}
                >
                  Board Directory
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          <NavItem href="/Home/Internships">Internships</NavItem>
          <NavItem href="/Home/Apply">Apply</NavItem>
          <li className="leading-none list-none">
            <Dropdown 
              classNames={{
                content: "bg-white p-0 border-0 shadow-lg min-w-[180px] overflow-hidden",
              }}
              onOpenChange={(open) => setIsServicesOpen(open)}
            >
              <DropdownTrigger>
                <button
                  className="nav-link block rounded px-[15px] py-[8px] font-normal text-white hover:text-white/80 no-underline !text-white cursor-pointer bg-transparent outline-none focus:outline-none focus-visible:outline-none border-0 flex items-center gap-2"
                  style={{color: 'white', fontSize: '18px', lineHeight: '50px', fontWeight: '400', backgroundColor: 'transparent', boxShadow: 'none'}}
                >
                  Client Services
                  <svg
                    className="transition-transform duration-300"
                    style={{
                      transform: isServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      width: '16px',
                      height: '16px',
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
                </button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Client Services menu"
                className="p-0 bg-white"
                itemClasses={{
                  base: "dropdown-item text-black data-[hover=true]:bg-transparent rounded-none px-4 m-0 text-center justify-center relative",
                }}
              >
                <DropdownItem 
                  key="our-services"
                  as={Link}
                  href="/Home/Services"
                  style={{fontSize: '18px', lineHeight: '50px', fontWeight: '400'}}
                >
                  Our Services
                </DropdownItem>
                <DropdownItem 
                  key="class-registration"
                  as={Link}
                  href="/Home/Classes"
                  style={{fontSize: '18px', lineHeight: '50px', fontWeight: '400'}}
                >
                  Class Registration
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          <NavItem href="/Home/SuccessStories">Success Stories</NavItem>
          <NavItem href="/Home/Locations">Locations</NavItem>
          <NavItem href="/Home/Newsletters">News</NavItem>
          <li className="leading-none list-none">
            <a
              href="#contact"
              onClick={handleContactClick}
              className="nav-link block rounded px-[15px] py-[8px] font-normal text-white hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 no-underline !text-white cursor-pointer"
              style={{color: 'white', fontSize: '18px', lineHeight: '50px', fontWeight: '400'}}
            >
              Contact
            </a>
          </li>
        </ul>
        <ul className="navbar-desktop-login flex items-center list-none mr-[5px]" style={{fontFamily: 'var(--font-sans)', marginTop: '0.5%'}}>
          <li className="list-none">
            <Link
              href="/Account/Login"
              id="loginLink"
              className="nav-link block px-[15px] py-[8px] font-normal text-white hover:text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 no-underline !text-white"
              style={{color: 'white', fontSize: '18px', lineHeight: '50px', fontWeight: '400'}}
            >
              Log In
            </Link>
          </li>
        </ul>

        {/* Mobile Menu */}
        <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-list" style={{fontFamily: 'var(--font-sans)'}}>
            <li><Link href="/" onClick={closeMobileMenu}>Home</Link></li>
            <li className="mobile-dropdown">
              <Dropdown 
                classNames={{
                  content: "bg-white p-0 border-0 shadow-lg min-w-[160px] overflow-hidden",
                }}
                onOpenChange={(open) => setIsAboutOpen(open)}
              >
                <DropdownTrigger>
                  <button className="mobile-dropdown-trigger">
                    About
                    <svg
                      className="transition-transform duration-300"
                      style={{
                        transform: isAboutOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        width: '16px',
                        height: '16px',
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
                  </button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="About menu"
                  className="p-0 bg-white"
                  itemClasses={{
                    base: "dropdown-item text-black data-[hover=true]:bg-transparent rounded-none px-4 m-0 text-center justify-center relative",
                  }}
                >
                  <DropdownItem 
                    key="about-us-mobile"
                    as={Link}
                    href="/Home/About"
                    onClick={closeMobileMenu}
                    style={{fontSize: '16px', lineHeight: '40px', fontWeight: '400'}}
                  >
                    About Us
                  </DropdownItem>
                  <DropdownItem 
                    key="staff-mobile"
                    onClick={(e) => { handleSectionClick(e as React.MouseEvent<HTMLElement>, "/Home/About#StaffSectionLoc", "StaffSectionLoc"); closeMobileMenu(); }}
                    style={{fontSize: '16px', lineHeight: '40px', fontWeight: '400', cursor: 'pointer'}}
                  >
                    Staff Directory
                  </DropdownItem>
                  <DropdownItem 
                    key="board-mobile"
                    onClick={(e) => { handleSectionClick(e as React.MouseEvent<HTMLElement>, "/Home/About#BoardSectionLoc", "BoardSectionLoc"); closeMobileMenu(); }}
                    style={{fontSize: '16px', lineHeight: '40px', fontWeight: '400', cursor: 'pointer'}}
                  >
                    Board Directory
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
            <li><Link href="/Home/Internships" onClick={closeMobileMenu}>Internships</Link></li>
            <li><Link href="/Home/Apply" onClick={closeMobileMenu}>Apply</Link></li>
            <li className="mobile-dropdown">
              <Dropdown 
                classNames={{
                  content: "bg-white p-0 border-0 shadow-lg min-w-[180px] overflow-hidden",
                }}
                onOpenChange={(open) => setIsServicesOpen(open)}
              >
                <DropdownTrigger>
                  <button className="mobile-dropdown-trigger">
                    Client Services
                    <svg
                      className="transition-transform duration-300"
                      style={{
                        transform: isServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        width: '16px',
                        height: '16px',
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
                  </button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Client Services menu"
                  className="p-0 bg-white"
                  itemClasses={{
                    base: "dropdown-item text-black data-[hover=true]:bg-transparent rounded-none px-4 m-0 text-center justify-center relative",
                  }}
                >
                  <DropdownItem 
                    key="our-services-mobile"
                    as={Link}
                    href="/Home/Services"
                    onClick={closeMobileMenu}
                    style={{fontSize: '16px', lineHeight: '40px', fontWeight: '400'}}
                  >
                    Our Services
                  </DropdownItem>
                  <DropdownItem 
                    key="class-registration-mobile"
                    as={Link}
                    href="/Home/Classes"
                    onClick={closeMobileMenu}
                    style={{fontSize: '16px', lineHeight: '40px', fontWeight: '400'}}
                  >
                    Class Registration
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
            <li><Link href="/Home/SuccessStories" onClick={closeMobileMenu}>Success Stories</Link></li>
            <li><Link href="/Home/Locations" onClick={closeMobileMenu}>Locations</Link></li>
            <li><Link href="/Home/Newsletters" onClick={closeMobileMenu}>News</Link></li>
            <li>
              <a
                href="#contact"
                onClick={(e) => { handleContactClick(e); closeMobileMenu(); }}
              >
                Contact
              </a>
            </li>
            <li>
              <Link href="/Account/Login" onClick={closeMobileMenu}>Log In</Link>
            </li>
          </ul>
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
          className="nav-link block rounded px-[15px] py-[8px] font-normal text-white hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 no-underline !text-white"
          style={{color: 'white', fontSize: '18px', lineHeight: '50px', fontWeight: '400'}}
        >
        { children }
      </Link>
    </li>
  );
}
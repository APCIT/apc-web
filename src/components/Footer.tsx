'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type StaffMember = {
  name: string;
  title: string;
  subtitle?: string;
  email: string;
  phone: string;
  profileHref: string;
};

type SocialLink = {
  iconSrc: string;
  href: string;
  text: string;
};

const STAFF_LEFT: StaffMember[] = [
  { name: 'Alan Hill', title: 'Executive Director', email: 'alan.hill@ua.edu', phone: '(205) 222-7111', profileHref: '/Profiles/AlanHill' },
  { name: 'Jan Ingenrieth', title: 'Director', subtitle: 'APC Internship Program', email: 'jan.ingenrieth@ua.edu', phone: '(205) 242-6057', profileHref: '/Profiles/JanIngenrieth' },
  { name: 'Morgan Harrison', title: 'Productivity Engineer', email: 'morgan.harrison@ua.edu', phone: '(205) 348-7968', profileHref: '/Profiles/MorganHarrison' },
  { name: 'Justin Rodgers', title: 'Productivity Engineer', email: 'justin.rodgers@ua.edu', phone: '(251) 234-1724', profileHref: '/Profiles/JustinRodgers' },
];

const STAFF_RIGHT: StaffMember[] = [
  { name: 'Susan Maples', title: 'Productivity Engineer', email: 'susan.maples@ua.edu', phone: '(205) 292-5848', profileHref: '/Profiles/SusanMaples' },
  { name: 'Ben Baxter', title: 'Productivity Engineer', email: 'ben.baxter@ua.edu', phone: '(205) 348-7957', profileHref: '/Profiles/BenBaxter' },
  { name: 'Tara Johnson', title: 'Business Manager', email: 'tara.johnson@ua.edu', phone: '(205) 348-8953', profileHref: '/Profiles/TaraJohnson' },
];

const SOCIAL: SocialLink[] = [
  { iconSrc: '/images/Icons/linkedinIcon (2).png', href: 'https://www.linkedin.com/company/alabamapc', text: 'Connect with us on LinkedIn!' },
  { iconSrc: '/images/Icons/FacebookIconBlack.png', href: 'https://www.facebook.com/uaapc/', text: 'Add us on Facebook!' },
  { iconSrc: '/images/Icons/instagram-icon (2).png', href: 'https://www.instagram.com/apc_uofa/', text: 'Follow us on Instagram!' },
  { iconSrc: '/images/Icons/YouTubeIconBlack.png', href: 'https://www.youtube.com/channel/UCz79rexgXksseSAp2s9tQgw', text: 'Subscribe to our YouTube!' },
  { iconSrc: '/images/Icons/NewsletterIconBlack.png', href: '/Home/Newsletters', text: 'Subscribe to our Newsletter!' },
];

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mt-4 mx-3 pr-8 text-sm uppercase tracking-wide font-semibold mb-4 pb-1 font-[Montserrat]">
    {children}
  </h2>
);

function telHref(human: string) {
  return `tel:${human.replace(/\D/g, '')}`;
}

const Footer: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.phone) return; // honeypot
    try {
      setStatus('sending');
      await new Promise((res) => setTimeout(res, 600));
      setStatus('ok');
      setForm({ name: '', email: '', message: '', phone: '' });
      setTimeout(() => setStatus('idle'), 3500);
    } catch {
      setStatus('fail');
    }
  }

  return (
    <>
      <div className="w-full bg-[#9E1B32] block shrink-0" style={{ height: '64px' }} aria-hidden="true"></div>
      <footer id="contact" className="footer-container bg-[#9E1B32] text-white py-12" style={{ paddingLeft: '4em', paddingRight: '4em' }}>
        <div className="container mx-auto px-8 lg:px-12">
        <div className="footer-grid grid grid-cols-12 gap-x-8 xl:gap-x-12 gap-y-8 items-start">
          {/* Left Column: Get In Touch + Contact */}
          <div className="footer-col-left col-span-5 min-w-0" style={{ paddingRight: '1em' }}>
            <Heading>Get In Touch</Heading>

            {status === 'ok' && (
              <div className="mb-4 rounded bg-green-100/90 px-3 py-2 text-green-900 text-sm">
                Message sent. We’ll get back to you soon.
              </div>
            )}
            {status === 'fail' && (
              <div className="mb-4 rounded bg-red-100/90 px-3 py-2 text-red-900 text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            {/* FORM */}
            <style dangerouslySetInnerHTML={{
              __html: `
                .contactForm input::placeholder,
                .contactForm textarea::placeholder {
                  color: rgba(255, 255, 255, 0.7);
                }
                .contactForm input:focus::placeholder,
                .contactForm textarea:focus::placeholder {
                  color: #999;
                }
              `
            }} />
            <form
              onSubmit={onSubmit}
              aria-label="Contact form"
              className="contactForm min-w-0 w-full"
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              {/* Name */}
              <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '1em', padding: '1em 0', width: '100%', boxSizing: 'border-box' }}>
                <label htmlFor="name" className="form-label" style={{ minWidth: '80px', fontFamily: 'Roboto, sans-serif', fontSize: '14px' }}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '280px',
                    maxWidth: '280px',
                    height: '40px',
                    padding: '0 15px',
                    fontSize: '14px',
                    color: focusedField === 'name' ? '#555555' : 'white',
                    backgroundColor: focusedField === 'name' ? '#fff' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '4px',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Email */}
              <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '1em', padding: '1em 0', width: '100%', boxSizing: 'border-box' }}>
                <label htmlFor="email" className="form-label" style={{ minWidth: '80px', fontFamily: 'Roboto, sans-serif', fontSize: '14px' }}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '280px',
                    maxWidth: '280px',
                    height: '40px',
                    padding: '0 15px',
                    fontSize: '14px',
                    color: focusedField === 'email' ? '#555555' : 'white',
                    backgroundColor: focusedField === 'email' ? '#fff' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '4px',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Message */}
              <div className="form-field" style={{ display: 'flex', alignItems: 'flex-start', gap: '1em', padding: '1em 0', width: '100%', boxSizing: 'border-box' }}>
                <label htmlFor="message" className="form-label" style={{ minWidth: '80px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', paddingTop: '10px' }}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="form-textarea"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '280px',
                    maxWidth: '280px',
                    padding: '10px 15px',
                    fontSize: '14px',
                    color: focusedField === 'message' ? '#555555' : 'white',
                    backgroundColor: focusedField === 'message' ? '#fff' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '4px',
                    fontFamily: 'Roboto, sans-serif',
                    resize: 'vertical',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <div className="form-submit-row" style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '1em',
                paddingTop: '1em',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div className="form-submit-spacer" style={{ minWidth: '80px' }}></div>
                <div className="form-submit-container" style={{ 
                  width: '280px',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    style={{
                      backgroundColor: 'white',
                      color: '#9E1B32',
                      fontSize: '14px',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      fontFamily: 'Roboto, sans-serif',
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      opacity: status === 'sending' ? 0.6 : 1,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-10">
              <Heading>Contact</Heading>
              <ul className="space-y-4 text-base">
                <li className="flex gap-3 items-start">
                  <Image
                    src="/images/Icons/Locations Icon PNG (1).png"
                    alt=""
                    width={20}
                    height={20}
                    className="mt-1 rounded-full"
                  />
                  <div>
                    2008 12th St.<br />
                    Tuscaloosa, AL. 35401
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <Image
                    src="/images/Icons/Contact Icon PNG (1).png"
                    alt=""
                    width={20}
                    height={20}
                    className="mt-1 rounded-full"
                  />
                  <div>
                    <a href={telHref('(205) 348-8956')} className="hover:underline">
                      (205) 348-8956
                    </a>
                    <br />
                    <a href="mailto:culverhouse-apcstaff@ua.edu" className="hover:underline">
                      culverhouse-apcstaff@ua.edu
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle Column: Staff */}
          <div className="footer-col-middle col-span-5 min-w-0" style={{ paddingLeft: '1em', paddingRight: '1em' }}>
            <Heading>Contact Info</Heading>

            <div className="staff-grid grid grid-cols-2 gap-x-12">
              {/* Left sub-column */}
              <div>
                 {STAFF_LEFT.map((s) => (
                   <div key={s.email} className="text-sm leading-relaxed" style={{ marginBottom: '2em' }}>
                    <div className="mb-1">
                      <Link href={s.profileHref} className="text-base hover:underline" style={{ fontWeight: 700 }}>
                        {s.name}
                      </Link>
                      <span className="italic text-gray-100/90">, {s.title}</span>
                    </div>
                    {s.subtitle && <div className="text-gray-100/90 mb-1">{s.subtitle}</div>}
                    <a href={`mailto:${s.email}`} className="block hover:underline mb-1">
                      {s.email}
                    </a>
                    <a href={telHref(s.phone)} className="block hover:underline">
                      {s.phone}
                    </a>
                  </div>
                ))}
              </div>

              {/* Right sub-column */}
              <div>
                 {STAFF_RIGHT.map((s) => (
                   <div key={s.email} className="text-sm leading-relaxed" style={{ marginBottom: '2em' }}>
                    <div className="mb-1">
                      <Link href={s.profileHref} className="text-base hover:underline" style={{ fontWeight: 700 }}>
                        {s.name}
                      </Link>
                      <span className="italic text-gray-100/90">, {s.title}</span>
                    </div>
                    {s.subtitle && <div className="text-gray-100/90 mb-1">{s.subtitle}</div>}
                    <a href={`mailto:${s.email}`} className="block hover:underline mb-1">
                      {s.email}
                    </a>
                    <a href={telHref(s.phone)} className="block hover:underline">
                      {s.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Social */}
          <div className="footer-col-right col-span-2 min-w-0" style={{ paddingLeft: '1em' }}>
            <Heading>Connect</Heading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
              {SOCIAL.map((s) => (
                <div key={s.href} className="flex items-center" style={{ gap: '1.5em' }}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.text}>
                    <Image src={s.iconSrc} alt="" width={52} height={52} className="rounded-full" />
                  </a>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline leading-snug"
                    style={{ fontSize: '15px' }}
                  >
                    {s.text}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div className="w-full bg-[#9E1B32] block shrink-0" style={{ height: '64px' }} aria-hidden="true"></div>
    </>
  );
};

export default Footer;

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const GRAD_YEARS = (() => {
  const y = new Date().getFullYear();
  return [y, y + 1, y + 2, y + 3, y + 4];
})();

export default function ApplicantSearchPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement)?.value?.trim() ?? '';
    const params = new URLSearchParams();
    const firstName = get('firstName');
    const lastName = get('lastName');
    const school = get('school');
    const major = get('major');
    const minor = get('minor');
    const level = get('level');
    const skills = get('skills');
    const foreignLanguage = get('foreignLanguage');
    const semester = get('semester');
    const city = get('city');
    const gradMonth = get('gradMonth');
    const gradYear = get('gradYear');
    if (firstName) params.set('FirstName', firstName);
    if (lastName) params.set('LastName', lastName);
    if (school) params.set('School', school);
    if (major) params.set('Major', major);
    if (minor) params.set('Minor', minor);
    if (level) params.set('Level', level);
    if (skills) params.set('Skills', skills);
    if (foreignLanguage) params.set('ForeignLanguage', foreignLanguage);
    if (semester) params.set('Semester', semester);
    if (city) params.set('City', city);
    if (gradMonth) params.set('GradMonth', gradMonth);
    if (gradYear) params.set('GradYear', gradYear);
    router.push(`/Applicants/SearchResults?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        {/* Spacer */}
        <div style={{ height: '20px' }}></div>

        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/Applicants" 
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
            style={{ fontWeight: 'normal', textDecoration: 'none' }}
          >
            <span className="text-[14px] font-bold" style={{ marginRight: '10px' }}>&#10094;</span>
            Back to Applicants
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-4">
          <h2 className="text-[30px] font-roboto" style={{ fontWeight: 'normal', color: '#000000' }}>
            Search
          </h2>
        </div>

        {/* Horizontal Rule */}
        <hr className="border-t border-[#ccc] mb-6" />

        {/* Search Form - POST semantics: submit redirects to SearchResults with query params */}
        <form className="max-w-4xl" onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              First Name
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <input
                type="text"
                name="firstName"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              Last Name
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <input
                type="text"
                name="lastName"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
              />
            </div>
          </div>

          {/* School */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              School
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <select
                name="school"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                <option value="">Please select your school</option>
                <option value="AAM">AAM - Alabama A&amp;M</option>
                <option value="ASU">ASU - Athens</option>
                <option value="AU">AU - Auburn</option>
                <option value="CCC">CCC - Calhoun Community College</option>
                <option value="COC">COC - Coastal Community College</option>
                <option value="DCC">DCC - Drake Community College</option>
                <option value="JSU">JSU - Jacksonville State University</option>
                <option value="MS">MS - Mississippi State</option>
                <option value="OM">OM - Ole Miss</option>
                <option value="PU">PU - Purdue</option>
                <option value="SC">SC - Stillman College</option>
                <option value="SSCC">SSCC - Shelton State Community College</option>
                <option value="TUS">TUS - Tuskegee University</option>
                <option value="TU">TU - Troy University</option>
                <option value="UA">UA - The University of Alabama</option>
                <option value="UAB">UAB - The University of Alabama at Birmingham</option>
                <option value="UAH">UAH - University of Alabama at Huntsville</option>
                <option value="UNA">UNA - University of North Alabama</option>
                <option value="USA">USA - University of South Alabama</option>
                <option value="UWA">UWA - University of West Alabama</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Major */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              Major
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <select
                name="major"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                <option value="">Select a Major</option>
                {/* Arts & Sciences */}
                <option value="" disabled>-----------ARTS &amp; SCIENCES-----------</option>
                <option value="BY">BY - Biology</option>
                <option value="CH">CH - Chemistry</option>
                <option value="ES">ES - Environmental Science</option>
                <option value="MS">MS - Marine Science</option>
                <option value="MA">MA - Mathematics</option>
                <option value="MBY">MBY - Microbiology</option>
                <option value="PH">PH - Physics</option>
                <option value="PY">PY - Psychology</option>
                <option value="PSC">PSC - Political Science</option>
                <option value="PUH">PUH - Public Health</option>
                {/* Business */}
                <option value="" disabled>-----------BUSINESS-----------</option>
                <option value="AC">AC - Accounting</option>
                <option value="GB">GB - Business, general</option>
                <option value="EC">EC - Economics</option>
                <option value="FI">FI - Finance</option>
                <option value="MGT">MGT - Management</option>
                <option value="MIS">MIS - Management Information Systems</option>
                <option value="MKT">MKT - Marketing</option>
                <option value="OM">OM - Operations Management</option>
                {/* Communications */}
                <option value="" disabled>-----------COMMUNICATIONS-----------</option>
                <option value="ADV">ADV - Advertising</option>
                <option value="COM">COM - Communication Studies</option>
                <option value="JN">JN - Journalism</option>
                <option value="PURL">PURL - Public Relations</option>
                <option value="TCF">TCF - Telecommunication and Film</option>
                {/* Engineering */}
                <option value="" disabled>-----------ENGINEERING-----------</option>
                <option value="AEM">AEM - Aerospace Engineering</option>
                <option value="BME">BME - Biomedical Engineering</option>
                <option value="CHE">CHE - Chemical Engineering</option>
                <option value="CE">CE - Civil Engineering</option>
                <option value="CS">CS - Computer Science</option>
                <option value="COE">COE - Computer Engineering</option>
                <option value="ECE">ECE - Electrical Engineering</option>
                <option value="ISE">ISE - Industrial and Systems Engineering</option>
                <option value="ME">ME - Mechanical Engineering</option>
                <option value="MTE">MTE - Metallurgical Engineering</option>
                {/* Human Environmental */}
                <option value="" disabled>-----------HUMAN ENVIRONMENTAL-----------</option>
                <option value="CSM">CSM - Consumer Sciences</option>
                <option value="HES">HES - Human Environmental Sciences</option>
                <option value="RHM">RHM - Restaurant and Hospitality Management</option>
                {/* Education */}
                <option value="" disabled>-----------EDUCATION-----------</option>
                <option value="KIN">KIN - Kinesiology</option>
                <option value="EXSC">EXSC - Exercise Science</option>
              </select>
            </div>
          </div>

          {/* Minor */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              Minor
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <input
                type="text"
                name="minor"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
              />
            </div>
          </div>

          {/* Level */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              Level
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <select
                name="level"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                <option value="">Select a Level</option>
                <option value="UG">UG</option>
                <option value="Master's">Master&apos;s</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              Skills
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <input
                type="text"
                name="skills"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
              />
            </div>
          </div>

          {/* Foreign Language */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              Foreign Language
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <select
                name="foreignLanguage"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                <option value="">Select Language</option>
                <option value="Arabic">Arabic</option>
                <option value="Chinese">Chinese</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Spanish">Spanish</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
          </div>

          {/* Semester */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              Semester
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <select
                name="semester"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                <option value="">Select Semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
          </div>

          {/* City */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              City
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <select
                name="city"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                <option value="">Select City</option>
                <option value="Birmingham">Birmingham</option>
                <option value="Huntsville">Huntsville</option>
                <option value="Mobile">Mobile</option>
                <option value="Montgomery">Montgomery</option>
                <option value="Tuscaloosa">Tuscaloosa</option>
                <option value="Anniston/Gadsden">Anniston/Gadsden</option>
                <option value="Dothan">Dothan</option>
                <option value="Blue Springs">Blue Springs</option>
              </select>
            </div>
          </div>

          {/* Graduation */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold">
              Graduation
            </label>
            <div className="flex-1 flex" style={{ marginLeft: '20px' }}>
              <select
                name="gradMonth"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                <option value="">Month</option>
                <option value="05">May</option>
                <option value="08">August</option>
                <option value="12">December</option>
              </select>
              <select
                name="gradYear"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
                style={{ marginLeft: '20px' }}
              >
                <option value="">Year</option>
                {GRAD_YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center mt-4">
            <div className="w-[180px]"></div>
            <div className="flex-1">
              <button
                type="submit"
                className="inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
              >
                submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

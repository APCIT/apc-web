'use client';

import Link from 'next/link';

export default function ApplicantSearchPage() {
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

        {/* Search Form */}
        <form className="max-w-4xl">
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
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Environmental Science">Environmental Science</option>
                <option value="Marine Science">Marine Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Physics">Physics</option>
                <option value="Psychology">Psychology</option>
                <option value="Political Science">Political Science</option>
                <option value="Public Health">Public Health</option>
                {/* Business */}
                <option value="" disabled>-----------BUSINESS-----------</option>
                <option value="Accounting">Accounting</option>
                <option value="Business, general">Business, general</option>
                <option value="Economics">Economics</option>
                <option value="Finance">Finance</option>
                <option value="Management">Management</option>
                <option value="Management Information Systems">Management Information Systems</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations Management">Operations Management</option>
                {/* Communications */}
                <option value="" disabled>-----------COMMUNICATIONS-----------</option>
                <option value="Advertising">Advertising</option>
                <option value="Communication Studies">Communication Studies</option>
                <option value="Journalism">Journalism</option>
                <option value="Public Relations">Public Relations</option>
                <option value="Telecommunication and Film">Telecommunication and Film</option>
                {/* Engineering */}
                <option value="" disabled>-----------ENGINEERING-----------</option>
                <option value="Aerospace Engineering">Aerospace Engineering</option>
                <option value="Biomedical Engineering">Biomedical Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Industrial and Systems Engineering">Industrial and Systems Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Metallurgical Engineering">Metallurgical Engineering</option>
                {/* Human Environmental */}
                <option value="" disabled>-----------HUMAN ENVIRONMENTAL-----------</option>
                <option value="Consumer Sciences">Consumer Sciences</option>
                <option value="Human Environmental Sciences">Human Environmental Sciences</option>
                <option value="Restaurant and Hospitality Management">Restaurant and Hospitality Management</option>
                {/* Education */}
                <option value="" disabled>-----------EDUCATION-----------</option>
                <option value="Kinesiology">Kinesiology</option>
                <option value="Exercise Science">Exercise Science</option>
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
                <option value="Undergraduate">Undergraduate</option>
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
                <option value="May">May</option>
                <option value="August">August</option>
                <option value="December">December</option>
              </select>
              <select
                name="gradYear"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto bg-white focus:outline-none focus:border-[#666] h-[40px]"
                style={{ marginLeft: '20px' }}
              >
                <option value="">Year</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
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

"use client";

import { Fragment, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import HeadingIntroBanner from "@/components/HeadingIntroBanner";
import { SUBMIT_APPLICATION_API } from "@/lib/api";

const MONTHS = [
  { v: "", t: "Month" },
  ...Array.from({ length: 12 }, (_, i) => ({
    v: String(i + 1),
    t: new Date(2000, i, 1).toLocaleString("en-US", { month: "long" }),
  })),
];

const DAYS = [{ v: "", t: "Day" }, ...Array.from({ length: 31 }, (_, i) => ({ v: String(i + 1), t: String(i + 1) }))];

const GRAD_MONTHS = [
  { v: "", t: "Month" },
  { v: "May ", t: "May" },
  { v: "August ", t: "August" },
  { v: "December ", t: "December" },
];

const US_STATES = [
  { v: "", t: "State" },
  { v: "AL", t: "Alabama" },
  { v: "AK", t: "Alaska" },
  { v: "AZ", t: "Arizona" },
  { v: "AR", t: "Arkansas" },
  { v: "CA", t: "California" },
  { v: "CO", t: "Colorado" },
  { v: "CT", t: "Connecticut" },
  { v: "DE", t: "Delaware" },
  { v: "FL", t: "Florida" },
  { v: "GA", t: "Georgia" },
  { v: "HI", t: "Hawaii" },
  { v: "ID", t: "Idaho" },
  { v: "IL", t: "Illinois" },
  { v: "IN", t: "Indiana" },
  { v: "IA", t: "Iowa" },
  { v: "KS", t: "Kansas" },
  { v: "KY", t: "Kentucky" },
  { v: "LA", t: "Louisiana" },
  { v: "ME", t: "Maine" },
  { v: "MD", t: "Maryland" },
  { v: "MA", t: "Massachusetts" },
  { v: "MI", t: "Michigan" },
  { v: "MN", t: "Minnesota" },
  { v: "MS", t: "Mississippi" },
  { v: "MO", t: "Missouri" },
  { v: "MT", t: "Montana" },
  { v: "NE", t: "Nebraska" },
  { v: "NV", t: "Nevada" },
  { v: "NH", t: "New Hampshire" },
  { v: "NJ", t: "New Jersey" },
  { v: "NM", t: "New Mexico" },
  { v: "NY", t: "New York" },
  { v: "NC", t: "North Carolina" },
  { v: "ND", t: "North Dakota" },
  { v: "OH", t: "Ohio" },
  { v: "OK", t: "Oklahoma" },
  { v: "OR", t: "Oregon" },
  { v: "PA", t: "Pennsylvania" },
  { v: "RI", t: "Rhode Island" },
  { v: "SC", t: "South Carolina" },
  { v: "SD", t: "South Dakota" },
  { v: "TN", t: "Tennessee" },
  { v: "TX", t: "Texas" },
  { v: "UT", t: "Utah" },
  { v: "VT", t: "Vermont" },
  { v: "VA", t: "Virginia" },
  { v: "WA", t: "Washington" },
  { v: "WV", t: "West Virginia" },
  { v: "WI", t: "Wisconsin" },
  { v: "WY", t: "Wyoming" },
];

const SCHOOLS = [
  { v: "", t: "Please select your school" },
  { v: "AAM", t: "AAM - Alabama A&M" },
  { v: "ASU", t: "ASU - Athens" },
  { v: "AU", t: "AU - Auburn" },
  { v: "CCC", t: "CCC - Calhoun Community College" },
  { v: "COC", t: "COC - Coastal Community College" },
  { v: "DCC", t: "DCC - Drake Community College" },
  { v: "JSU", t: "JSU - Jacksonville State University" },
  { v: "MS", t: "MS - Mississippi State" },
  { v: "OM", t: "OM - Ole Miss" },
  { v: "PU", t: "PU - Purdue" },
  { v: "SC", t: "SC - Stillman College" },
  { v: "SSCC", t: "SSCC - Shelton State Community College" },
  { v: "TUS", t: "TUS - Tuskegee University" },
  { v: "TU", t: "TU - Troy University" },
  { v: "UA", t: "UA - The University of Alabama" },
  { v: "UAB", t: "UAB - The University of Alabama at Birmingham" },
  { v: "UAH", t: "UAH - University of Alabama at Huntsville" },
  { v: "UNA", t: "UNA - University of North Alabama" },
  { v: "USA", t: "USA - University of South Alabama" },
  { v: "UWA", t: "UWA - University of West Alabama" },
  { v: "Other", t: "Other" },
];

type MajorOpt = { v: string; t: string };
type MajorGroup = { divider: string; options: MajorOpt[] };

const MAJOR_GROUPS: MajorGroup[] = [
  {
    divider: "---------------ARTS & SCIENCES--------------",
    options: [
      { v: "BY", t: "Biology" },
      { v: "CH", t: "Chemistry" },
      { v: "ES", t: "Environmental Science" },
      { v: "MS", t: "Marine Science" },
      { v: "MA", t: "Mathematics" },
      { v: "MBY", t: "Microbiology" },
      { v: "PH", t: "Physics" },
      { v: "PY", t: "Psychology" },
      { v: "PSC", t: "Political Science" },
      { v: "PUH", t: "Public Health" },
    ],
  },
  {
    divider: "--------------------BUSINESS--------------------",
    options: [
      { v: "AC", t: "Accounting" },
      { v: "GB", t: "Business, general" },
      { v: "EC", t: "Economics" },
      { v: "FI", t: "Finance" },
      { v: "MGT", t: "Management" },
      { v: "MIS", t: "Management Information Systems" },
      { v: "MKT", t: "Marketing" },
      { v: "OM", t: "Operations Management" },
    ],
  },
  {
    divider: "--------------COMMUNICATIONS--------------",
    options: [
      { v: "ADV", t: "Advertising" },
      { v: "COM", t: "Communication Studies" },
      { v: "JN", t: "Journalism" },
      { v: "PURL", t: "Public Relations" },
      { v: "TCF", t: "Telecommunication and Film" },
    ],
  },
  {
    divider: "------------------ENGINEERING-----------------",
    options: [
      { v: "AEM", t: "Aerospace Engineering" },
      { v: "BME", t: "Biomedical Engineering" },
      { v: "CHE", t: "Chemical Engineering" },
      { v: "CE", t: "Civil Engineering" },
      { v: "CS", t: "Computer Science" },
      { v: "COE", t: "Computer Engineering" },
      { v: "ECE", t: "Electrical Engineering" },
      { v: "ISE", t: "Industrial and Systems Engineering" },
      { v: "ME", t: "Mechanical Engineering" },
      { v: "MTE", t: "Metallurgical Engineering" },
    ],
  },
  {
    divider: "----------HUMAN ENVIRONMENTAL----------",
    options: [
      { v: "CSM", t: "Consumer Sciences" },
      { v: "HES", t: "Human Environmental Sciences" },
      { v: "RHM", t: "Restaurant and Hospitality Management" },
    ],
  },
  {
    divider: "---------EDUCATION----------",
    options: [
      { v: "KIN", t: "Kinesiology" },
      { v: "EXSC", t: "Exercise Science" },
    ],
  },
];

const LEVELS = [
  { v: "", t: "Please select your level" },
  { v: "UG", t: "Undergraduate" },
  { v: "Master's", t: "Master's" },
  { v: "PhD", t: "PhD" },
];

const MAJOR_PLACEHOLDER_VALUE = "__none__";

function MajorSelect({ id, name, style, hasError }: { id: string; name: string; style: CSSProperties; hasError?: boolean }) {
  return (
    <select id={id} name={name} style={{ ...style, ...(hasError ? errBorder : {}) }} defaultValue={MAJOR_PLACEHOLDER_VALUE}>
      <option value={MAJOR_PLACEHOLDER_VALUE}>Please select a major</option>
      {MAJOR_GROUPS.map((g) => (
        <Fragment key={g.divider}>
          <option value="" disabled>
            {g.divider}
          </option>
          {g.options.map((o) => (
            <option key={`${g.divider}-${o.v}`} value={o.v}>
              {o.t}
            </option>
          ))}
        </Fragment>
      ))}
    </select>
  );
}

const LANGUAGES = [
  { v: "", t: "None" },
  { v: "Arabic", t: "Arabic" },
  { v: "Chinese", t: "Chinese" },
  { v: "French", t: "French" },
  { v: "German", t: "German" },
  { v: "Italian", t: "Italian" },
  { v: "Japanese", t: "Japanese" },
  { v: "Spanish", t: "Spanish" },
  { v: "Korean", t: "Korean" },
];

const LOCATION_OPTIONS = [
  "Birmingham, AL",
  "Huntsville, AL",
  "Mobile, AL",
  "Montgomery, AL",
  "Tuscaloosa, AL",
  "Anniston/Gadsden, AL",
  "Dothan, AL",
  "Blue Springs, MS",
];

const inputStyle: CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "0.45rem 0.65rem",
  fontSize: "1rem",
  background: "#fff",
  fontFamily: "Roboto, sans-serif",
  maxWidth: "100%",
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  minWidth: "140px",
};

const labelStyle: CSSProperties = {
  color: "#000",
  fontWeight: 700,
  fontFamily: "Roboto, sans-serif",
  textAlign: "right",
  paddingTop: "0.45rem",
  paddingRight: "0.75rem",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "24px",
  color: "#900",
  fontFamily: "Roboto, sans-serif",
  fontWeight: 700,
  margin: "0 0 1rem 0",
};

const helperStyle: CSSProperties = {
  fontSize: "0.875rem",
  color: "#88929a",
  marginTop: "0.25rem",
  fontFamily: "Roboto, sans-serif",
};

const optionTextStyle: CSSProperties = {
  color: "#88929a",
  fontFamily: "Roboto, sans-serif",
  fontSize: "0.95rem",
};

const errBorder: CSSProperties = { borderColor: "#d32f2f" };
const errTextStyle: CSSProperties = {
  color: "#d32f2f",
  fontSize: "0.8rem",
  marginTop: "0.25rem",
  fontFamily: "Roboto, sans-serif",
};

function FormRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(140px, 22%) 1fr",
        gap: "0.75rem 1rem",
        alignItems: "start",
        marginBottom: "1rem",
      }}
    >
      <div style={labelStyle}>{label}</div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p style={errTextStyle}>{msg}</p>;
}

function getSemesterLabels(): [string, string, string] {
  const now = new Date();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  if (m <= 2) return [`Spring ${y}`, `Summer ${y}`, `Fall ${y}`];
  if (m <= 6) return [`Summer ${y}`, `Fall ${y}`, `Spring ${y + 1}`];
  if (m <= 9) return [`Fall ${y}`, `Spring ${y + 1}`, `Summer ${y + 1}`];
  return [`Spring ${y + 1}`, `Summer ${y + 1}`, `Fall ${y + 1}`];
}

export default function ApplyPage() {
  const router = useRouter();
  const yearNow = new Date().getFullYear();
  const [semThis, semNext, semThird] = getSemesterLabels();

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  const gradYearOptions = [
    { v: "", t: "Year" },
    ...[0, 1, 2, 3, 4].map((i) => ({ v: String(yearNow + i), t: String(yearNow + i) })),
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGlobalError("");

    const formData = new FormData(e.currentTarget);
    const res = await SUBMIT_APPLICATION_API(formData);

    if (!res.ok) {
      setErrors(res.errors ?? {});
      setGlobalError(res.error);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    router.push(`/Apply/Thankyou?name=${encodeURIComponent(res.firstName)}`);
  }

  const e = errors;
  const eb = (field: string) => (e[field] ? errBorder : {});

  return (
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: "#eee", minHeight: "calc(100vh - 100px)" }}>
      <HeadingIntroBanner
        title="Internship Application"
        backgroundImage="/images/industry-798642.jpg"
        backgroundPosition="bottom"
        height="15em"
      />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
        {globalError && (
          <div
            style={{
              background: "#fdecea",
              border: "1px solid #f5c6cb",
              color: "#721c24",
              padding: "0.75rem 1rem",
              borderRadius: "4px",
              marginBottom: "1.5rem",
              fontFamily: "Roboto, sans-serif",
              fontSize: "0.95rem",
            }}
          >
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
          {/* ─── Personal ─── */}
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={sectionTitleStyle}>Personal</h2>

            <FormRow label={<label htmlFor="firstName">First Name</label>}>
              <div>
                <input id="firstName" name="firstName" type="text" style={{ ...inputStyle, width: "100%", maxWidth: "420px", ...eb("firstName") }} autoComplete="given-name" />
                <ErrMsg msg={e.firstName} />
              </div>
            </FormRow>

            <FormRow label={<label htmlFor="lastName">Last Name</label>}>
              <div>
                <input id="lastName" name="lastName" type="text" style={{ ...inputStyle, width: "100%", maxWidth: "420px", ...eb("lastName") }} autoComplete="family-name" />
                <ErrMsg msg={e.lastName} />
              </div>
            </FormRow>

            <FormRow label="Birthday">
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <select id="dobMonth" name="DobMonth" style={{ ...selectStyle, ...eb("dob") }} defaultValue="">
                    {MONTHS.map((o) => (
                      <option key={o.v || "m-empty"} value={o.v}>
                        {o.t}
                      </option>
                    ))}
                  </select>
                  <select id="dobDay" name="DobDay" style={{ ...selectStyle, ...eb("dob") }} defaultValue="">
                    {DAYS.map((o) => (
                      <option key={o.v || "d-empty"} value={o.v}>
                        {o.t}
                      </option>
                    ))}
                  </select>
                </div>
                <ErrMsg msg={e.dob} />
              </div>
            </FormRow>

            <FormRow label={<label htmlFor="email">Email</label>}>
              <div>
                <input id="email" name="email" type="email" style={{ ...inputStyle, width: "100%", maxWidth: "420px", ...eb("email") }} autoComplete="email" />
                <ErrMsg msg={e.email} />
              </div>
            </FormRow>

            <FormRow label={<label htmlFor="phone">Phone</label>}>
              <div>
                <input id="phone" name="phone" type="tel" style={{ ...inputStyle, width: "220px", ...eb("phone") }} autoComplete="tel" />
                <p style={helperStyle}>Ex: (555) 555-5555</p>
                <ErrMsg msg={e.phone} />
              </div>
            </FormRow>

            <FormRow label="Permanent Address">
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <input id="street" name="street" type="text" placeholder="Street" style={{ ...inputStyle, width: "min(330px, 100%)", ...eb("street") }} autoComplete="street-address" />
                  <input id="apt" name="apt" type="text" placeholder="Apt" style={{ ...inputStyle, width: "120px" }} />
                </div>
                <ErrMsg msg={e.street} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input id="city" name="city" type="text" placeholder="City" style={{ ...inputStyle, width: "160px", ...eb("city") }} autoComplete="address-level2" />
                  <select id="state" name="StateList" style={{ ...selectStyle, ...eb("state") }} defaultValue="">
                    {US_STATES.map((o) => (
                      <option key={o.v || "s-empty"} value={o.v}>
                        {o.t}
                      </option>
                    ))}
                  </select>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    placeholder="ZIP"
                    style={{ ...inputStyle, width: "100px", ...eb("zip") }}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                  />
                </div>
                <ErrMsg msg={e.city} />
                <ErrMsg msg={e.state} />
                <ErrMsg msg={e.zip} />
              </div>
            </FormRow>

            <FormRow label="Emergency Contact">
              <div>
                <input id="emergencyName" name="emergencyName" type="text" placeholder="Name" style={{ ...inputStyle, width: "min(330px, 100%)", ...eb("contactName") }} />
                <ErrMsg msg={e.contactName} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginTop: "0.5rem" }}>
                  <input id="emergencyPhone" name="emergencyPhone" type="tel" placeholder="Phone" style={{ ...inputStyle, width: "220px", ...eb("contactPhone") }} />
                  <span style={{ ...helperStyle, marginTop: 0 }}>Ex: (555) 555-5555</span>
                </div>
                <ErrMsg msg={e.contactPhone} />
                <input
                  id="emergencyRelationship"
                  name="emergencyRelationship"
                  type="text"
                  placeholder="Relationship"
                  style={{ ...inputStyle, width: "min(330px, 100%)", marginTop: "0.5rem", ...eb("contactRelationship") }}
                />
                <ErrMsg msg={e.contactRelationship} />
              </div>
            </FormRow>
          </section>

          {/* ─── Education ─── */}
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={sectionTitleStyle}>Education</h2>

            <FormRow label={<label htmlFor="school">School</label>}>
              <div>
                <select id="school" name="SchoolList" style={{ ...selectStyle, width: "100%", maxWidth: "420px", ...eb("school") }} defaultValue="">
                  {SCHOOLS.map((o) => (
                    <option key={o.v || "sch-empty"} value={o.v}>
                      {o.t}
                    </option>
                  ))}
                </select>
                <ErrMsg msg={e.school} />
              </div>
            </FormRow>

            <FormRow label={<label htmlFor="major">Major</label>}>
              <div>
                <MajorSelect id="major" name="MajorList" style={{ ...selectStyle, width: "100%", maxWidth: "420px" }} hasError={!!e.major} />
                <ErrMsg msg={e.major} />
              </div>
            </FormRow>

            <FormRow label={<label htmlFor="minor">Minor</label>}>
              <input id="minor" name="minor" type="text" placeholder="Optional" style={{ ...inputStyle, width: "100%", maxWidth: "420px" }} />
            </FormRow>

            <FormRow label={<label htmlFor="level">Level</label>}>
              <div>
                <select id="level" name="LevelList" style={{ ...selectStyle, width: "100%", maxWidth: "420px", ...eb("level") }} defaultValue="">
                  {LEVELS.map((o) => (
                    <option key={o.v || "lvl-empty"} value={o.v}>
                      {o.t}
                    </option>
                  ))}
                </select>
                <ErrMsg msg={e.level} />
              </div>
            </FormRow>

            <FormRow label="Graduation">
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <select id="gradMonth" name="GradMonth" style={{ ...selectStyle, ...eb("gradDate") }} defaultValue="">
                    {GRAD_MONTHS.map((o) => (
                      <option key={o.v || "gm-empty"} value={o.v}>
                        {o.t}
                      </option>
                    ))}
                  </select>
                  <select id="gradYear" name="GradYear" style={{ ...selectStyle, ...eb("gradDate") }} defaultValue="">
                    {gradYearOptions.map((o) => (
                      <option key={o.v || "gy-empty"} value={o.v}>
                        {o.t}
                      </option>
                    ))}
                  </select>
                </div>
                <ErrMsg msg={e.gradDate} />
              </div>
            </FormRow>

            <FormRow label={<label htmlFor="foreignLanguage">Foreign Language</label>}>
              <select id="foreignLanguage" name="ForeignLanguageList" style={{ ...selectStyle, width: "100%", maxWidth: "420px" }} defaultValue="">
                {LANGUAGES.map((o) => (
                  <option key={o.v || "lang-none"} value={o.v}>
                    {o.t}
                  </option>
                ))}
              </select>
            </FormRow>

            <FormRow label={<label htmlFor="skills">Skills</label>}>
              <div>
                <input id="skills" name="skills" type="text" placeholder="Optional" style={{ ...inputStyle, width: "100%", maxWidth: "420px" }} />
                <p style={helperStyle}>Examples: Excel Macros, AutoCad, SAP, C#</p>
              </div>
            </FormRow>
          </section>

          {/* ─── Employment ─── */}
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={sectionTitleStyle}>Employment</h2>

            <FormRow label="Are you legally authorized to work in the U.S.?">
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", ...optionTextStyle }}>
                <input id="validEmp" name="validEmp" type="checkbox" />
                <span>Yes</span>
              </label>
            </FormRow>

            <FormRow label="Have you previously interned with APC?">
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", ...optionTextStyle }}>
                <input id="prevIntern" name="prevIntern" type="checkbox" />
                <span>Yes</span>
              </label>
            </FormRow>

            <FormRow label={<label htmlFor="preference">Preference</label>}>
              <div>
                <input id="preference" name="preference" type="text" placeholder="Optional" style={{ ...inputStyle, width: "100%", maxWidth: "420px" }} />
                <p style={helperStyle}>Use this space to record company or job type preferences</p>
              </div>
            </FormRow>

            <FormRow label="Availability">
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", ...optionTextStyle }}>
                    <input id="thisSemester" name="thisSemester" type="checkbox" />
                    <span>{semThis}</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", ...optionTextStyle }}>
                    <input id="nextSemester" name="nextSemester" type="checkbox" />
                    <span>{semNext}</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", ...optionTextStyle }}>
                    <input id="thirdSemester" name="thirdSemester" type="checkbox" />
                    <span>{semThird}</span>
                  </label>
                </div>
                <ErrMsg msg={e.semester} />
              </div>
            </FormRow>

            <FormRow label="Location(s)">
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 1.25rem" }}>
                  {LOCATION_OPTIONS.map((loc) => {
                    const locId = `loc-${loc.replace(/[^\w]+/g, "-").toLowerCase()}`;
                    return (
                      <label key={locId} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", ...optionTextStyle }}>
                        <input id={locId} name="locations" type="checkbox" value={loc} />
                        <span>{loc}</span>
                      </label>
                    );
                  })}
                </div>
                <ErrMsg msg={e.locations} />
              </div>
            </FormRow>

            <FormRow label={<label htmlFor="resume">Resume</label>}>
              <div>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "0.95rem",
                    color: "#000",
                  }}
                />
                <ErrMsg msg={e.resume} />
              </div>
            </FormRow>

            <FormRow label={<label htmlFor="heardAbout">How did you hear about us?</label>}>
              <input id="heardAbout" name="heardAbout" type="text" placeholder="Optional" style={{ ...inputStyle, width: "100%", maxWidth: "420px" }} />
            </FormRow>
          </section>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: submitting ? "#b0b0b0" : "#9E1B32",
                color: "#fff",
                border: "none",
                padding: "0.65rem 2.5rem",
                fontSize: "1.25rem",
                fontWeight: 700,
                borderRadius: "4px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "Roboto, sans-serif",
                transition: "background-color 0.2s",
              }}
            >
              {submitting ? "Submitting..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        #resume[type="file"] {
          color: #000 !important;
          -webkit-text-fill-color: #000 !important;
        }
      `}</style>
    </div>
  );
}

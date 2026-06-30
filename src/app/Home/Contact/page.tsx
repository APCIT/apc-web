import HeadingIntroBanner from "@/components/HeadingIntroBanner";

const staff = [
  {
    group: "",
    people: [
      {
        name: "Alan Hill",
        title: "Executive Director",
        email: "alan.hill@ua.edu",
        phone: "(205) 222-7111",
      },
      {
        name: "Jan Ingenrieth",
        title: "Director, APC Internship Program",
        email: "jan.ingenrieth@ua.edu",
        phone: "(205) 242-6057",
      },
      {
        name: "Susan Maples",
        title: "Productivity Engineer",
        email: "susan.maples@ua.edu",
        phone: "(205) 292-5848",
      },
      {
        name: "Ben Baxter",
        title: "Productivity Engineer",
        email: "ben.baxter@ua.edu",
        phone: "(205) 348-7957",
      },
      {
        name: "Morgan Harrison",
        title: "Productivity Engineer",
        email: "morgan.harrison@ua.edu",
        phone: "(205) 348-7968",
      },
      {
        name: "Justin Rodgers",
        title: "Productivity Engineer",
        email: "justin.rodgers@ua.edu",
        phone: "(251) 234-1724",
      },
    ],
  },
];

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/alabamapc",
    icon: "/images/Icons/linkedin-brands-solid.png",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/uaapc/",
    icon: "/images/Icons/facebook-brands-solid.png",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/apc_uofa/",
    icon: "/images/Icons/instagram-brands-solid.png",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCz79rexgXksseSAp2s9tQgw",
    icon: "/images/Icons/youtube-brands-solid.png",
  },
  {
    name: "Newsletters",
    href: "https://signup.e2ma.net/signup/2096667/2062159/",
    icon: "/images/Icons/envelope-solid.png",
  },
];

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

const crimson = "#9E1B32";
const crimsonDark = "#70202C";
const text = "#35363B";
const textAlt = "#4A4C54";
const subtle = "#757C88";
const lightGray = "#F2F3F4";
const border = "#DFE2E5";

export default function Page() {
  return (
    <main style={{ backgroundColor: "#FFFFFF", color: "white",  fontFamily: "proxima-nova, sans-serif",}}>
      <HeadingIntroBanner
        title="Contact Us"
        backgroundImage="/images/Contact-Banner.JPG"
        backgroundPosition="center"
      />

      <section
        style={{
          maxWidth: "77rem",
          margin: "0 auto",
          padding: "3.5rem 1.5rem 3rem",
          textAlign: "center",
        }}
      ></section>

      <section
  style={{
    maxWidth: "77rem",
    margin: "0 auto",
    padding: "0 1.5rem 4rem",
    display: "grid",
    gridTemplateColumns: "1.8fr 0.8fr",
    gap: "2rem",
    alignItems: "stretch",
  }}
>
  {/* Contact cards */}
  <div
  style={{
    display: "grid",
    gridTemplateColumns: "1",
    gap: "1.5rem",
  }}
>
    <article
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #DFE2E5",
        borderRadius: "12px",
        color: "#FFFFFF",
        padding: "2rem",
        textAlign: "center",
        boxShadow: "0 12px 28px rgba(0,0,0,.14)",
      }}
    >
      <h3 style={{ color: '#212124', fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        Visit Us
      </h3>
      <p style={{ color: '#4A4C54', lineHeight: "1.7rem" }}>
        2008 12th Street<br />
        Tuscaloosa, AL 35401
      </p>
    </article>

    <article
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #DFE2E5",
        borderRadius: "12px",
        padding: "2rem",
        textAlign: "center",
        boxShadow: "0 12px 28px rgba(0,0,0,.14)",
      }}
    >
      <h3 style={{ color: '#212124', fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        Call Us
      </h3>
      <a href="tel:+12053488956" style={{ color: '#9E1B32', fontWeight: 600, textDecoration: "underline" }}>
        (205) 348-8956
      </a>
    </article>

    <article
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #DFE2E5",
        borderRadius: "12px",
        padding: "2rem",
        textAlign: "center",
        boxShadow: "0 12px 28px rgba(0,0,0,.14)",
      }}
    >
      <h3 style={{ color: '#212124', fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        Email Us
      </h3>
      <a href="mailto:culverhouse-apcstaff@ua.edu" style={{ color: '#9E1B32', fontWeight: 600, textDecoration: "underline" }}>
        culverhouse-apcstaff@ua.edu
      </a>
    </article>
  </div>

  {/* Social panel */}
  <aside
    style={{
      backgroundColor: crimson,
      color: "#FFFFFF",
      padding: "2rem",
      borderRadius: "20px",
      boxShadow: "0 12px 28px rgba(0,0,0,.12)",
    }}
  >
    <h2
      style={{
        fontSize: "1.35rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        borderBottom: "3px solid rgba(255,255,255,0.45)",
        paddingBottom: "0.75rem",
        marginBottom: "1.5rem",
      }}
    >
      Connect
    </h2>

    <div style={{ display: "grid", gap: "1.5rem" }}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="transition-all duration-200 hover:translate-x-1 hover:opacity-80"
          style={{
            color: "#FFFFFF",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "1rem",
            lineHeight: "1.35rem",
          }}
        >
          <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "999px",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            }}
            >
            <img
              src={link.icon}
              alt={link.name}
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                display: "block",
            }}
          />
          </div>

          <span>
            {link.name === "LinkedIn"
              ? "Connect with us on LinkedIn!"
              : link.name === "Facebook"
              ? "Add us on Facebook!"
              : link.name === "Instagram"
              ? "Follow us on Instagram!"
              : link.name === "YouTube"
              ? "Subscribe to our YouTube!"
              : "Subscribe to our Newsletter!"}
          </span>
        </a>
      ))}
    </div>
  </aside>
</section>

<section
  style={{
    backgroundColor: "#F2F3F4",
    padding: "5rem 1.5rem",
  }}
>
  <div
    style={{
      maxWidth: "77rem",
      margin: "0 auto",
    }}
  >
    <h2
      style={{
        color: crimson,
        fontSize: "2.25rem",
        fontWeight: 600,
        marginBottom: "0.5rem",
        textAlign: 'center'
      }}
    >
      Staff Contacts
    </h2>

      <div
        style={{
          width: "70px",
          height: "4px",
          backgroundColor: crimson,
          margin: "0 auto 3rem",
        }}
      />
    <p
      style={{
        color: 'FFFFFF',
        maxWidth: "48rem",
        lineHeight: "1.75rem",
        marginBottom: "2rem",
      }}
    >
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "2.25rem",
      }}
    >
      {staff.flatMap((group) => group.people).map((person) => (
        <article
          key={person.email}
          style={{
            backgroundColor: "#2B2C31",
            border: "1px solid #35363B",
            borderRadius: "18px",
            padding: "1.75rem",
            boxShadow: "0 12px 28px rgba(0,0,0,.14)",
            transition: "transform .2s ease, box-shadow .2s ease",
          }}
        >
          <h3
            style={{
              color: 'FFFFFF',
              fontSize: "1.35rem",
              fontWeight: 600,
              marginBottom: "0.25rem",
            }}
          >
            {person.name}
          </h3>

          <p
            style={{
              color: '#DFE2E5',
              marginBottom: "1.25rem",
              lineHeight: "1.5rem",
            }}
          >
            {person.title}
          </p>
            
          <a
            href={`mailto:${person.email}`}
            style={{
              display: "block",
              color: "#E87C90",
              textDecoration: "underline",
              marginBottom: "0.5rem",
            }}
          >
            {person.email}
          </a>

          <a
            href={telHref(person.phone)}
            style={{
              display: "block",
              color: "#E87C90",
              textDecoration: "underline",
            }}
          >
            {person.phone}
          </a>
        </article>
      ))}
    </div>
  </div>
</section>
    </main>
  );
}
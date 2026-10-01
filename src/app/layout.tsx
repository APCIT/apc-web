import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PartnerFooter from "@/components/PartnerFooter";
import RouteTitle from "@/components/RouteTitle";
import { Providers } from "./providers";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "APC",
};

function UniversityBrandBar() {
  return (
    <div className="ua_minerva">
      <section className="ua_brand-bar">
        <div className="ua_brand-bar_content">
          <a href="https://ua.edu" className="ua_brand-bar_logo">
            <img
              src="https://assetfiles.ua.edu/brand/logos/UA_Wordmark-White.svg"
              alt="The University of Alabama"
            />
          </a>

          <a href="http://mybama.ua.edu/" className="ua_brand-bar_link">
            myBama
          </a>
        </div>
      </section>
    </div>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const initialUser =
    session?.isLoggedIn && session?.userId
      ? { userName: session.userName }
      : null;
  const initialRoles = session?.roles ?? [];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/Favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/Favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/Favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/images/Favicon/apple-icon.png" />
        <link rel="manifest" href="/images/Favicon/manifest.json" />
        <link href="https://fonts.googleapis.com/css?family=Sanchez:400,400italic&display=optional" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=optional" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500&display=optional" rel="stylesheet" type="text/css" />
      </head>
      <body className="antialiased">
        <Providers>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <UniversityBrandBar/>
          <RouteTitle />
          <Navbar initialUser={initialUser} initialRoles={initialRoles} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <PartnerFooter />
        </Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import Navbar from "@/components/Navbar";
import PartnerFooter from "@/components/PartnerFooter";
import { Providers } from "./providers";
import { getSession } from "@/lib/auth";

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
        <link href="https://fonts.googleapis.com/css?family=Sanchez:400,400italic&display=optional" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=optional" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500&display=optional" rel="stylesheet" type="text/css" />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar initialUser={initialUser} initialRoles={initialRoles} />
          <main className="pt-[100px]">
            {children}
          </main>
          <PartnerFooter />
        </Providers>
      </body>
    </html>
  );
}

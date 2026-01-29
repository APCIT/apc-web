import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PartnerFooter from '@/components/PartnerFooter';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Sanchez:400,400italic" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500" rel="stylesheet" type="text/css" />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar/>
          <main className="pt-[100px]">
            {children}
          </main>
          <PartnerFooter />
        </Providers>
      </body>
    </html>
  );
}

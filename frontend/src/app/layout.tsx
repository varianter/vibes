import Head from "next/head";

import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Head>
        <title>Vibes Frontend</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <body className="layout-grid">
        <NavBar />
        <NextTopLoader color="#F076A6" height={3} initialPosition={0.2} />
        {children}
      </body>
    </html>
  );
}

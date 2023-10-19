import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";
import { Metadata } from "next";

export const metaData: Metadata = {
  title: "Vibes",
  description: ""
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}

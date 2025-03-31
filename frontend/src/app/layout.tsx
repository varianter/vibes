import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import NavBar from "@/components/NavBar/NavBar";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { setOrganisationInCookie } from "@/hooks/setOrganisationInCookies";
import { PropsWithChildren } from "react";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { OrganisationReadModel } from "@/api-types";
import { OrganizationContextProvider } from "@/context/organization";
import { ReactQueryClientProvider } from "@/query-client";

export const metadata: Metadata = {
  title: "VIBES",
  icons: {
    icon: "/favicon.png",
  },
  viewport: {
    minimumScale: 1,
    initialScale: 1,
    width: "device-width",
  },
  other: {
    version: `vibes-${process.env.NEXT_PUBLIC_VIBES_GIT_SHA || "dev"}`,
  },
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const cookieStore = cookies();
  const chosenOrg = cookieStore.get("chosenOrg")?.value;

  const organizations =
    (await fetchWithToken<OrganisationReadModel[]>("organisations")) ?? [];

  return (
    <html>
      <body className="layout-grid">
        <ReactQueryClientProvider>
          <OrganizationContextProvider
            organizations={organizations}
            organization={chosenOrg}
            setOrganization={setOrganisationInCookie}
          >
            <NavBar />
            <NextTopLoader
              showSpinner={false}
              color="#FF87B7"
              height={3}
              initialPosition={0.2}
            />
            {children}
          </OrganizationContextProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}

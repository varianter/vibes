"use client";

import { useOrganizationContext } from "@/context/organization";
import Link from "next/link";
import OrganisationButton from "@/components/OrganisationButton";
import { redirect } from "next/navigation";

export default function Root() {
  const { organization, organizations } = useOrganizationContext();

  if (organizations.find((o) => o.urlKey == organization)) {
    redirect(`/${organization}/bemanning`);
  }

  return (
    <ul className="main h-screen flex items-center justify-center gap-4">
      {organizations.map((o) => (
        <li key={o.urlKey}>
          <Link href={`/${o.urlKey}/bemanning`}>
            <OrganisationButton org={o} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

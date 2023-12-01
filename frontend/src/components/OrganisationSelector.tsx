"use client";
import { Organisation } from "@/types";
import Link from "next/link";
import ActionButton from "./Buttons/ActionButton";
import { useRouter } from "next/navigation";

export function OrganisationSelector({ orgs }: { orgs: Organisation[] }) {
  const router = useRouter();

  /*if (typeof window !== "undefined") {
    const chosenUrlKey = localStorage.getItem("chosenUrlKey");

    if (orgs.find((o) => o.urlKey == chosenUrlKey)) {
      router.push(`/${chosenUrlKey}/bemanning`);
    }
  }*/

  function setUrlKey(urlKey: string): void {
    localStorage.setItem("chosenUrlKey", urlKey);
  }

  return (
    <>
      {orgs.map((o) => (
        <li key={o.urlKey}>
          <Link href={`/${o.urlKey}/bemanning`}>
            <ActionButton
              variant="secondary"
              onClick={() => setUrlKey(o.urlKey)}
            >
              {o.name}
            </ActionButton>
          </Link>
        </li>
      ))}
    </>
  );
}

export default function OrganisationButton({
  org,
  setCookie,
}: {
  org: Organisation;
  setCookie: (string: string) => void;
}) {
  return (
    <ActionButton variant="secondary" onClick={() => setCookie(org.urlKey)}>
      {org.name}
    </ActionButton>
  );
}

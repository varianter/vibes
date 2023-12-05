"use client";
import { Organisation } from "@/types";
import ActionButton from "./Buttons/ActionButton";
import { setOrganisationInCookie } from "../hooks/setOrganisationInCookies";

export default function OrganisationButton({ org }: { org: Organisation }) {
  return (
    <ActionButton
      variant="secondary"
      onClick={() => setOrganisationInCookie(org.urlKey)}
    >
      {org.name}
    </ActionButton>
  );
}

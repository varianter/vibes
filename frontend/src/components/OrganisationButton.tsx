"use client";
import { OrganisationReadModel } from "@/api-types";
import ActionButton from "./Buttons/ActionButton";
import { setOrganisationInCookie } from "../hooks/setOrganisationInCookies";

export default function OrganisationButton({
  org,
}: {
  org: OrganisationReadModel;
}) {
  return (
    <ActionButton
      variant="secondary"
      onClick={() => setOrganisationInCookie(org.urlKey)}
    >
      {org.name}
    </ActionButton>
  );
}

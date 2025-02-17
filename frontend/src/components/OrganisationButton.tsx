"use client";
import { OrganisationReadModel } from "@/api-types";
import ActionButton from "./Buttons/ActionButton";
import { useOrganizationContext } from "@/context/organization";

export default function OrganisationButton({
  org,
}: {
  org: OrganisationReadModel;
}) {
  const { setOrganization } = useOrganizationContext();

  return (
    <ActionButton
      variant="secondary"
      onClick={() => setOrganization(org.urlKey)}
    >
      {org.name}
    </ActionButton>
  );
}

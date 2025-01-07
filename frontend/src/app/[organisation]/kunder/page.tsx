import { EngagementPerCustomerReadModel, EngagementState } from "@/api-types";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { CustomerFilterProvider } from "@/hooks/CustomerFilter/CustomerFilterProvider";
import { CustomerContent } from "@/pagecontent/CustomerContent";
import { Metadata } from "next";
import WeekToMonth from "./weekToMonthConverter";

export const metadata: Metadata = {
  title: "Kunder | VIBES",
};

export default async function Kunder({
  params,
}: {
  params: { organisation: string };
}) {
  const customersWAbsence =
    (await fetchWithToken<EngagementPerCustomerReadModel[]>(
      `${params.organisation}/projects`,
    )) ?? [];

  const customers = customersWAbsence.filter(
    (c) => c.engagements.at(0)?.bookingType != EngagementState.Absence,
  );

  const absence = customersWAbsence.filter(
    (c) => c.engagements.at(0)?.bookingType == EngagementState.Absence,
  );
  WeekToMonth();

  return (
    <CustomerFilterProvider customers={customers}>
      <CustomerContent absence={absence} />
    </CustomerFilterProvider>
  );
}

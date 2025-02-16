import {
  CustomersWithProjectsReadModel,
  DepartmentReadModel,
} from "@/api-types";
import CustomerSidebar from "@/components/CustomerTable/CustomerSidebar";
import CustomerTable from "@/components/CustomerTable/CustomerTable";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import { fetchWorkHoursPerWeek } from "@/hooks/fetchWorkHoursPerDay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kunder | VIBES",
};

export default async function Kunde({
  params,
}: {
  params: { organisation: string; customer: string };
}) {
  const customer =
    (await fetchWithToken<CustomersWithProjectsReadModel>(
      `${params.organisation}/projects/${params.customer}`,
    )) ?? undefined;

  const departments =
    (await fetchWithToken<DepartmentReadModel[]>(
      `organisations/${params.organisation}/departments`,
    )) ?? [];

  const numWorkHours =
    (await fetchWorkHoursPerWeek(params.organisation)) || 37.5;

  return (
    <ConsultantFilterProvider
      consultants={[]}
      competences={[]}
      departments={departments}
      customers={[]}
    >
      {customer && (
        <>
          <CustomerSidebar customer={customer} />
          <CustomerTable
            customer={customer}
            orgUrl={params.organisation}
            numWorkHours={numWorkHours}
          />
        </>
      )}
    </ConsultantFilterProvider>
  );
}

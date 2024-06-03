import {
  CustomersWithProjectsReadModel,
  DepartmentReadModel,
} from "@/api-types";
import CustomerSidebar from "@/components/CostumerTable/CustomerSidebar";
import CustomerTable from "@/components/CostumerTable/CustomerTable";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
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
          <CustomerTable customer={customer} orgUrl={params.organisation} />
        </>
      )}
    </ConsultantFilterProvider>
  );
}

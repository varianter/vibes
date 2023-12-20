import { CustomersWithProjectsReadModel } from "@/api-types";
import CustomerSidebar from "@/components/CostumerTable/CustomerSidebar";
import CustomerTable from "@/components/CostumerTable/CustomerTable";
import { fetchWithToken } from "@/data/apiCallsWithToken";

export default async function Kunde({
  params,
}: {
  params: { organisation: string; customer: string };
}) {
  const customer =
    (await fetchWithToken<CustomersWithProjectsReadModel>(
      `${params.organisation}/projects/${params.customer}`,
    )) ?? undefined;

  return (
    <>
      {customer && (
        <>
          <CustomerSidebar customer={customer} />
          <CustomerTable customer={customer} orgUrl={params.organisation} />
        </>
      )}
    </>
  );
}

import { EngagementPerCustomerReadModel } from "@/api-types";
import CustomerTable from "@/components/CustomerTable";
import { fetchWithToken } from "@/data/apiCallsWithToken";

export default async function Kunde({
  params,
}: {
  params: { organisation: string; customer: string };
}) {
  const customer =
    (await fetchWithToken<EngagementPerCustomerReadModel>(
      `${params.organisation}/projects/${params.customer}`,
    )) ?? undefined;

  return (
    <>
      {customer && (
        <CustomerTable customer={customer} orgUrl={params.organisation} />
      )}
    </>
  );
}

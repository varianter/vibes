import { CustomersWithProjectsReadModel } from "@/api-types";
import CustomerTable from "@/components/CustomerTable";
import { fetchWithToken } from "@/data/apiCallsWithToken";

export default async function Kunde({
  params,
}: {
  params: { organisation: string; customer: string };
}) {
  const customer =
    (await fetchWithToken<CustomersWithProjectsReadModel>(
      `${params.organisation}/projects/${params.customer}`, //Kanskje bruk id eller noen form for url-safe navn?
    )) ?? undefined;

  //Deal with permisjoner og ferie

  return (
    <>
      {customer && (
        <CustomerTable customer={customer} orgUrl={params.organisation} />
      )}
    </>
  );
}

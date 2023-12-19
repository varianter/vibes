import { EngagementPerCustomerReadModel, EngagementState } from "@/api-types";
import CustomerRow from "@/components/CustomerRow";
import { fetchWithToken } from "@/data/apiCallsWithToken";

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

  return (
    <div className="flex flex-row">
      <div className="sidebar z-10">
        <div className=" bg-primary/5 h-full flex flex-col gap-6 p-4 w-[300px]">
          <div className="flex flex-row justify-between items-center">
            <h1 className="">Filter</h1>
          </div>
          Ikke implementert
        </div>
      </div>
      <div className="p-4 pt-5 w-full flex flex-col gap-8">
        <h1>Kunder</h1>

        <table className="w-full min-w-[700px] table-fixed">
          <colgroup>
            <col span={1} className="w-16" />
            <col span={1} className="w-[190px]" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <col key={index} span={1} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th colSpan={2}>
                <div className="flex flex-row gap-3 pb-4 items-center">
                  <p className="normal-medium ">Kunder</p>
                  <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                    {customers?.length}
                  </p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {customers
              .sort((a, b) => a.customerName.localeCompare(b.customerName))
              .map((customer) => (
                <CustomerRow key={customer.customerId} customer={customer} />
              ))}
          </tbody>
        </table>
        <table className="w-full min-w-[700px] table-fixed">
          <colgroup>
            <col span={1} className="w-16" />
            <col span={1} className="w-[190px]" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <col key={index} span={1} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th colSpan={2}>
                <div className="flex flex-row gap-3 pb-4 items-center">
                  <p className="normal-medium ">Permisjoner</p>
                  <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                    {absence?.length}
                  </p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {absence.map((customer) => (
              <CustomerRow key={customer.customerId} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

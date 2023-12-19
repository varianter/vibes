import { EngagementPerCustomerReadModel } from "@/api-types";
import EngagementRow from "@/components/EngagementRow";
import InfoBox from "@/components/InfoBox";
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
    <div className="flex flex-row h-full">
      <div className="sidebar z-10">
        <div className=" bg-primary/5 h-full flex flex-col gap-6 p-4 w-[300px]">
          <div className="flex flex-row justify-between items-center">
            <h1 className="">Info</h1>
          </div>
          <p>Om</p>
          <InfoBox
            infoName={"Navn på kunde"}
            infoValue={customer?.customerName}
          />
          <p>Bemanning</p>
          <InfoBox
            infoName={"Antall engasjement"}
            infoValue={customer?.engagements.length.toString()}
          />
        </div>
      </div>
      {customer && (
        <div className="p-4 pt-5 w-full flex flex-col gap-8">
          <h1>{customer?.customerName}</h1>

          <table className="w-full min-w-[700px] table-fixed">
            <colgroup>
              <col span={1} className="w-54" />
              <col span={1} className="w-[200px]" />
            </colgroup>
            <thead>
              <tr>
                <th colSpan={2}>
                  <div className="flex flex-row gap-3 pb-4 items-center">
                    <p className="normal-medium ">Engasjement</p>
                    <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                      {customer?.engagements.length}
                    </p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {customer?.engagements.map((engagement) => (
                <tr key={engagement.engagementId}>
                  <EngagementRow
                    key={engagement.engagementId}
                    engagement={engagement}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

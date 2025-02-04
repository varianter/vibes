import { CustomersWithProjectsReadModel } from "@/api-types";
import InfoBox from "../InfoBox";
import DepartmentFilter from "../DepartmentFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export default function CustomerSidebar({
  customer,
}: {
  customer: CustomersWithProjectsReadModel;
}) {
  return (
    <div className="sidebar z-10 h-full">
      <div className=" bg-primary/5 h-full flex flex-col gap-6 p-4 w-[300px]">
        <div className="flex flex-row justify-between items-center gap-6">
          <h1 className="">Info og filter</h1>
        </div>
        <DepartmentFilter context={FilteredContext} />

        <div className="flex flex-col gap-2">
          <p className="small">Om</p>
          <InfoBox
            infoName={"Navn på kunde"}
            infoValue={customer?.customerName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="small">Bemanning</p>
          <InfoBox
            infoName={"Antall aktive engasjement"}
            infoValue={customer?.activeEngagements?.length.toString()}
          />
          <InfoBox
            infoName={"Antall inaktive engasjement"}
            infoValue={customer?.inactiveEngagements?.length.toString()}
          />
        </div>
      </div>
    </div>
  );
}

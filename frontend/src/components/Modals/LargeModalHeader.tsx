import { ProjectWithCustomerModel } from "@/api-types";
import {
  getColorByProjectState,
  getIconByProjectState,
} from "../Staffing/helpers/utils";

export function LargeModalHeader({
  project,
}: {
  project?: ProjectWithCustomerModel;
}) {
  const projectStateColor = getColorByProjectState(project?.bookingType);

  return (
    <div className="flex flex-row gap-3 items-center">
      <div
        className={`w-[60px] h-[60px] rounded-lg flex justify-center items-center ${projectStateColor}`}
      >
        {getIconByProjectState(32, project?.bookingType)}
      </div>
      <div className="flex flex-col justify-center">
        <h1>{project?.projectName}</h1>
        <div className="flex flex-row gap-2 items-center">
          <p className="normal text-black">{project?.customerName}</p>
          <div className="w-1 h-1 rounded-full bg-black"></div>
          <p className="normal text-black">{project?.bookingType}</p>
          <div className="w-1 h-1 rounded-full bg-black"></div>
          <p className="normal text-black">
            {project?.isBillable ? "Fakturerbart" : "Ikke fakturerbart"}
          </p>
        </div>
      </div>
    </div>
  );
}

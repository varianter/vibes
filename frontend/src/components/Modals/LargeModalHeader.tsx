import { ProjectState } from "@/types";

export function LargeModalHeader({
  engagementName,
  customerName,
  type,
}: {
  engagementName: string;
  customerName: string;
  type: ProjectState;
}) {
  return (
    <div className="flex flex-row gap-3 items-center">
      {/* <div className="w-[60px] h-[60px] bg-offer rounded-lg flex justify-center items-center"> */}
      {/* {getIconProjectType(type, 32)} */}
      {/* </div> */}
      <div className="flex flex-col justify-center">
        <h1>{engagementName}</h1>
        <div className="flex flex-row gap-2 items-center">
          <p className="normal text-black">{customerName}</p>
          <div className="w-1 h-1 rounded-full bg-black"></div>
          <p className="normal text-black">{type}</p>
        </div>
      </div>
    </div>
  );
}

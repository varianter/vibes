import { useSimpleConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";
import React from "react";

export default function FilteredConsultants() {
  const { filteredConsultants } = useSimpleConsultantsFilter();

  return (
    <table
      className={`w-full min-w-[700px] border-separate border-spacing-y-1`}
    >
      {/*
          <colgroup>
            <col span={1} className="w-14" />
            <col span={1} className="w-[190px]" />
            {[...Array(9)].map((_, index) => (
              <col key={index} span={1} />
            ))}
          </colgroup> 
            */}
      <thead>
        <tr className="sticky -top-6 bg-white z-10">
          <th className="px-2 py-1 pt-3 bg-white">
            <div className="flex flex-row gap-1 items-center">
              <p className="normal-medium ">Konsulenter</p>
              <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                {filteredConsultants.filter((e) => !e.endDate)?.length}
              </p>
            </div>
          </th>

          <th className=" px-2 py-1 pt-3 ">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Mail</p>
            </div>
          </th>

          <th className=" px-2 py-1 pt-3 ">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Startdato</p>
            </div>
          </th>

          <th className=" px-2 py-1 pt-3 ">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Sluttdato</p>
            </div>
          </th>

          <th className=" px-2 py-1 pt-3 ">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Avdeling</p>
            </div>
          </th>

          <th className=" px-2 py-1 pt-3 ">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Kompetanse</p>
            </div>
          </th>

          <th className=" px-2 py-1 pt-3 ">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Grad</p>
            </div>
          </th>

          <th className=" px-2 py-1 pt-3 ">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Eksamensår</p>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        {filteredConsultants
          .filter((e) => !e.endDate)
          .map((consultant) => (
            <tr
              key={consultant.id}
              className="h-[52px] bg-background_light_purple hover:bg-background_light_purple_hover transition-all cursor-pointer rounded-md"
            >
              <td className="px-2 py-1 rounded-l-md">
                <p className="normal">{consultant.name}</p>
                <p className="text-xs text-text_light_black">
                  Erfaring {consultant.yearsOfExperience}år
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.email}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.startDate
                    ? new Date(consultant?.startDate).toDateString()
                    : "-"}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.endDate
                    ? new Date(consultant?.endDate).toDateString()
                    : "-"}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.department}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.competences.map((c) => c.name).join(", ") ?? ""}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.degree}
                </p>
              </td>
              <td className="px-2 py-1 rounded-r-md">
                <p className="normal text-text_light_black">
                  {consultant.graduationYear}
                </p>
              </td>
            </tr>
          ))}
        <tr>
          <td className="py-4 font-bold text-">
            <div className="flex flex-row gap-1 items-center">
              <p className="normal-medium ">Inaktive konsulenter</p>
              <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                {filteredConsultants.filter((e) => e.endDate)?.length}
              </p>
            </div>
          </td>
        </tr>

        {filteredConsultants
          .filter((e) => e.endDate)
          .map((consultant) => (
            <tr
              key={consultant.id}
              className="h-[52px] bg-background_light_purple hover:bg-background_light_purple_hover transition-all cursor-pointer rounded-md"
            >
              <td className="px-2 py-1 rounded-l-md">
                <p className="normal">{consultant.name}</p>
                <p className="text-xs text-text_light_black">
                  Erfaring {consultant.yearsOfExperience}år
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.email}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.startDate
                    ? new Date(consultant?.startDate).toDateString()
                    : "-"}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.endDate
                    ? new Date(consultant?.endDate).toDateString()
                    : "-"}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.department}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.competences.map((c) => c.name).join(", ") ?? ""}
                </p>
              </td>
              <td className="px-2 py-1">
                <p className="normal text-text_light_black">
                  {consultant.degree}
                </p>
              </td>
              <td className="px-2 py-1 rounded-r-md">
                <p className="normal text-text_light_black">
                  {consultant.graduationYear}
                </p>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

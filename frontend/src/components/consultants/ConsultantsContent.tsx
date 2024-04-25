"use client";

import StaffingSidebar from "@/components/StaffingSidebar";
import { useContext, useState } from "react";
import IconActionButton from "../Buttons/IconActionButton";
import { Filter, Plus } from "react-feather";
import ActiveFilters from "../ActiveFilters";
import FilteredConsultantsComp from "./FilteredConsultantsComp";
import AddNewConsultantModal from "./AddNewConsultantModal";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { ConsultantReadModel } from "@/api-types";
import { useSimpleConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";

export default function ConsultantContent() {
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { setConsultants } = useSimpleConsultantsFilter();
  const [toggleAddConsultant, setToggleAddConsultant] =
    useState<boolean>(false);
  const { setIsDisabledHotkeys, isDisabledHotkeys } =
    useContext(FilteredContext);

  return (
    <>
      <StaffingSidebar
        isStaffing={false}
        isSidebarOpen={isSideBarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />
      <div className="main p-4 pt-5 w-full flex flex-col gap-8">
        <div className="w-full flex flex-row justify-between">
          <h1>Konsulenter</h1>

          <button
            className="py-2 px-3 bg-primary text-white rounded-md flex flex-row items-center gap-2"
            onClick={() => {
              setIsDisabledHotkeys(true);
              setToggleAddConsultant(true);
            }}
          >
            <Plus size="20" /> Legg til konsulent
          </button>
        </div>

        <div className="flex flex-row justify-between items-center pt-[12px]">
          <div className="flex flex-row items-center gap-3">
            <IconActionButton
              variant={"secondary"}
              icon={<Filter />}
              onClick={() => setIsSidebarOpen((wasOpen) => !wasOpen)}
            />
            <ActiveFilters />
          </div>
        </div>
        <FilteredConsultantsComp isModalOpen={toggleAddConsultant} />
      </div>
      {toggleAddConsultant && (
        <AddNewConsultantModal
          onClose={(res: ConsultantReadModel | null) => {
            if (res !== null) {
              // add new consultant to list
              setConsultants((prevConsultants) => [...prevConsultants, res]);
            }
            setIsDisabledHotkeys(false);
            setToggleAddConsultant(false);
          }}
        />
      )}
    </>
  );
}

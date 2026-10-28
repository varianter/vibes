"use client";

import StaffingSidebar from "@/components/StaffingSidebar";
import { useContext, useState } from "react";
import IconActionButton from "../Buttons/IconActionButton";
import { Filter, Plus } from "react-feather";
import ActiveFilters from "../ActiveFilters";
import FilteredConsultantsComp from "./FilteredConsultantsComp";
import AddNewConsultantModal from "./AddNewConsultantModal";
import UploadConsultantDocumentModal from "./UploadConsultantDocumentModal";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { ConsultantReadModel, ConsultantWriteModel } from "@/api-types";
import { useSimpleConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";
import ActionButton from "../Buttons/ActionButton";
import { ConsultantDocumentDraft } from "@/types";
import { draftToInitialValues } from "./consultantDocumentDraft";

export default function ConsultantContent() {
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { setConsultants } = useSimpleConsultantsFilter();
  const [toggleAddConsultant, setToggleAddConsultant] =
    useState<boolean>(false);
  const [toggleUploadDocument, setToggleUploadDocument] =
    useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<
    Partial<ConsultantWriteModel> | undefined
  >();
  const { setIsDisabledHotkeys, isDisabledHotkeys, departments } =
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

          <div className="flex flex-row items-center gap-2">
            <ActionButton
              variant="primary"
              className="py-2 px-3 rounded-md flex flex-row items-center gap-2"
              onClick={() => {
                setIsDisabledHotkeys(true);
                setToggleUploadDocument(true);
              }}
            >
              <Plus size="20" /> Legg til konsulent (automatisert/beta)
            </ActionButton>
            <ActionButton
              variant="primary"
              className="py-2 px-3 rounded-md flex flex-row items-center gap-2"
              onClick={() => {
                setIsDisabledHotkeys(true);
                setToggleAddConsultant(true);
              }}
            >
              <Plus size="20" /> Legg til konsulent
            </ActionButton>
          </div>
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
      {toggleUploadDocument && (
        <UploadConsultantDocumentModal
          onClose={(draft: ConsultantDocumentDraft | null) => {
            setToggleUploadDocument(false);
            if (draft === null) {
              setIsDisabledHotkeys(false);
              return;
            }
            // open the regular form pre-filled, so the values are reviewed before saving
            setInitialValues(draftToInitialValues(draft, departments));
            setToggleAddConsultant(true);
          }}
        />
      )}
      {toggleAddConsultant && (
        <AddNewConsultantModal
          initialValues={initialValues}
          onClose={(res: ConsultantReadModel | null) => {
            if (res !== null) {
              // add new consultant to list
              setConsultants((prevConsultants) => [...prevConsultants, res]);
            }
            setIsDisabledHotkeys(false);
            setToggleAddConsultant(false);
            setInitialValues(undefined);
          }}
        />
      )}
    </>
  );
}

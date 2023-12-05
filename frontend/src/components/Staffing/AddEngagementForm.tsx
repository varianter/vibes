import React, {
  ChangeEvent,
  FormEvent,
  RefObject,
  useContext,
  useState,
} from "react";
import { useModal } from "@/hooks/useModal";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import ReactSelect, { SelectOption } from "@/components/ReactSelect";
import { MultiValue } from "react-select";
import EasyModal from "@/components/Modals/EasyModal";
import { AddEngagementHoursModal } from "@/components/Staffing/AddEngagementHoursModal";
import {
  EngagementWriteModel,
  ProjectState,
  ProjectWithCustomerModel,
} from "@/types";
import { usePathname } from "next/navigation";
import ActionButton from "../Buttons/ActionButton";

export function AddEngagementForm({
  closeEngagementModal,
  easyModalRef,
}: {
  closeEngagementModal: () => void;
  easyModalRef: RefObject<HTMLDialogElement>;
}) {
  const { openModal, modalRef } = useModal({
    closeOnBackdropClick: false,
  });

  const organisationName = usePathname().split("/")[1];

  const { customers, consultants } = useContext(FilteredContext);
  // State for select components
  const [selectedCustomer, setSelectedCustomer] = useState<SelectOption | null>(
    null,
  );
  const [selectedEngagement, setSelectedEngagement] =
    useState<SelectOption | null>(null);

  const [selectedConsultants, setSelectedConsultants] =
    useState<MultiValue<SelectOption> | null>(null);

  const [project, setProject] = useState<
    ProjectWithCustomerModel | undefined
  >();

  const customerOptions = customers.map(
    (c) =>
      ({
        value: `${c.customerId}`,
        label: `${c.customerName}`,
      }) as SelectOption,
  );

  const projectOptions =
    customers
      .find((c) => c.customerId == selectedCustomer?.value)
      ?.engagements?.map(
        (e) =>
          ({
            value: `${e.engagementId}`,
            label: `${e.engagementName}`,
          }) as SelectOption,
      ) ?? [];

  const consultantOptions =
    consultants.map(
      (c) =>
        ({
          value: `${c.id}`,
          label: `${c.name}`,
        }) as SelectOption,
    ) ?? [];

  // State for radio button group
  const [radioValue, setRadioValue] = useState(ProjectState.Offer);

  // State for toggle
  const [isFakturerbar, setIsFakturerbar] = useState(false);

  // Handler for select components
  function handleSelectedCustomerChange(newCustomer: SelectOption) {
    setSelectedCustomer(newCustomer);
    setSelectedEngagement(null);
  }

  function handleSelectedEngagementChange(newValue: SelectOption) {
    setSelectedEngagement(newValue);
  }

  // Handler for radio button group
  function handleRadioChange(event: ChangeEvent<HTMLInputElement>) {
    setRadioValue(event.target.value as ProjectState);
  }

  // Handler for toggle
  function handleToggleChange() {
    setIsFakturerbar(!isFakturerbar);
  }

  async function submitAddEngagementForm(body: EngagementWriteModel) {
    const url = `/${organisationName}/bemanning/api/projects`;

    try {
      const data = await fetch(url, {
        method: "put",
        body: JSON.stringify({
          ...body,
        }),
      });
      return (await data.json()) as ProjectWithCustomerModel;
    } catch (e) {
      console.error("Error updating staffing", e);
    }
  }

  // Handler for form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Needed to prevent the form from refreshing the page
    event.preventDefault();
    event.stopPropagation();
    // Add your submission logic here
    console.log(event);
    console.log("Form submitted!");

    const body: EngagementWriteModel = {
      consultantIds: selectedConsultants?.map((c) => Number(c.value)), // Solid existing
      customerName: selectedCustomer?.label,
      projectName: selectedEngagement?.label,
      projectState: radioValue,
      isBillable: isFakturerbar,
    };

    const result = await submitAddEngagementForm(body);

    if (result) {
      setProject(result);
    }

    console.log(result);

    //TODO: Need to close the add engagement modal before opening the large modal
    closeEngagementModal();
    openModal();

    // TODO: Legg på noe post-greier her
  }

  return (
    <>
      <EasyModal
        modalRef={easyModalRef}
        title={"Legg til engasjement"}
        showCloseButton={true}
      >
        <div className="min-h-[300px]">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 pt-6 h-96">
              {/* Selected Customer */}
              <div className="flex flex-col gap-2">
                <p className="small text-black">Konsulenter</p>
                <ReactSelect
                  options={consultantOptions}
                  selectedMultipleOptionsValue={selectedConsultants}
                  onMultipleOptionsChange={setSelectedConsultants}
                  isMultipleOptions={true}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="small text-black">Kunde</p>
                <ReactSelect
                  options={customerOptions}
                  selectedSingleOptionValue={selectedCustomer}
                  onSingleOptionChange={handleSelectedCustomerChange}
                  isMultipleOptions={false}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="small text-black">Engasjement</p>
                <ReactSelect
                  options={projectOptions}
                  onSingleOptionChange={handleSelectedEngagementChange}
                  selectedSingleOptionValue={selectedEngagement}
                  isMultipleOptions={false}
                />
              </div>
              {/* Radio Button Group */}
              <div className="flex flex-row gap-4">
                <label className="flex gap-2 normal items-center">
                  <input
                    type="radio"
                    value={ProjectState.Offer}
                    checked={radioValue === ProjectState.Offer}
                    onChange={handleRadioChange}
                  />
                  Tilbud
                </label>
                <label className="flex gap-2 normal items-center">
                  <input
                    type="radio"
                    value={ProjectState.Order}
                    checked={radioValue === ProjectState.Order}
                    onChange={handleRadioChange}
                  />
                  Ordre
                </label>
              </div>
              {/* Toggle (Checkbox) */}
              <label className="flex flex-row justify-between items-center">
                Fakturerbart
                <div
                  className={`rounded-full w-[52px] h-7 flex items-center  ${
                    isFakturerbar ? "bg-primary" : "bg-black/20"
                  }`}
                  onClick={handleToggleChange}
                >
                  <div
                    className={`m-[2px] bg-white rounded-full w-6 h-6 ${
                      isFakturerbar && " translate-x-6"
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            <ActionButton variant="primary" fullWidth type="submit">
              Legg til engasjement
            </ActionButton>
          </form>
        </div>
      </EasyModal>
      <AddEngagementHoursModal
        modalRef={modalRef}
        weekSpan={8}
        project={project}
        chosenConsultants={consultants.slice(0, 3)}
      />
    </>
  );
}

import React, {
  ChangeEvent,
  FormEvent,
  RefObject,
  useContext,
  useState,
} from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import ComboBox, { SelectOption } from "@/components/ComboBox";
import { MultiValue } from "react-select";
import EasyModal from "@/components/Modals/EasyModal";
import {
  ConsultantReadModel,
  EngagementState,
  EngagementWriteModel,
  ProjectWithCustomerModel,
} from "@/api-types";
import { usePathname } from "next/navigation";
import ActionButton from "../Buttons/ActionButton";

export function AddEngagementForm({
  closeEngagementModal,
  easyModalRef,
  consultant,
}: {
  closeEngagementModal: (
    project: ProjectWithCustomerModel,
    selectedConsultants: ConsultantReadModel[],
  ) => void;
  easyModalRef: RefObject<HTMLDialogElement>;
  consultant: ConsultantReadModel;
}) {
  const { customers, consultants, setIsDisabledHotkeys } =
    useContext(FilteredContext);

  const organisationName = usePathname().split("/")[1];
  // State for select components
  const [selectedCustomer, setSelectedCustomer] = useState<SelectOption | null>(
    null,
  );
  const [selectedEngagement, setSelectedEngagement] =
    useState<SelectOption | null>(null);

  const selectedConsultant: SelectOption = {
    value: consultant.id.toString(),
    label: consultant.name,
  };

  const [selectedConsultants, setSelectedConsultants] =
    useState<MultiValue<SelectOption> | null>([selectedConsultant]);

  const [_, setProject] = useState<ProjectWithCustomerModel | undefined>();

  const customerOptions = customers.map(
    (c) =>
      ({
        value: `${c.customerId}`,
        label: `${c.customerName}`,
      }) as SelectOption,
  );

  let uniqueLabels = new Set();
  const projectOptions =
    customers
      .find((c) => c.customerId == selectedCustomer?.value)
      ?.engagements?.map(
        (e) =>
          ({
            value: `${e.engagementId}`,
            label: `${e.engagementName}`,
          }) as SelectOption,
      )
      .filter((e) => !uniqueLabels.has(e.label) && uniqueLabels.add(e.label)) ??
    [];

  const consultantOptions =
    consultants.map(
      (c) =>
        ({
          value: `${c.id}`,
          label: `${c.name}`,
        }) as SelectOption,
    ) ?? [];

  // State for radio button group
  const [radioValue, setRadioValue] = useState(EngagementState.Offer);

  // State for toggle
  const [isFakturerbar, setIsFakturerbar] = useState(true);

  // Hardcoded, based on ID from backend. Hopefully we can find a more graceful solution in the future
  const isAbsence = selectedCustomer?.value == -1;

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
    setRadioValue(event.target.value as EngagementState);
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

    const body: EngagementWriteModel = {
      customerName: selectedCustomer?.label,
      projectName: selectedEngagement?.label,
      bookingType: isAbsence ? EngagementState.Absence : radioValue,
      isBillable: isFakturerbar,
    };

    const result = await submitAddEngagementForm(body);

    // TODO: This is a simplified mockup.
    if (result) {
      setProject(result);
      closeEngagementModal(
        result,
        consultants.filter(
          (c) => selectedConsultants?.some((sc) => sc.value == c.id.toString()),
        ),
      );
      setIsDisabledHotkeys(true);
      resetSelectedValues();

      // TODO: Futher logic for the changes in openModal *here*
    } else console.error("Error adding engagement");
    // TODO: #370 - Error handling for snackbars here
  }

  function resetSelectedValues() {
    setSelectedCustomer(null);
    setSelectedEngagement(null);
    setSelectedConsultants([selectedConsultant]);
    setRadioValue(EngagementState.Offer);
    setIsFakturerbar(true);
  }

  return (
    <>
      <EasyModal
        modalRef={easyModalRef}
        title={"Legg til engasjement"}
        showCloseButton={true}
        onClose={() => {
          setIsDisabledHotkeys(false);
          resetSelectedValues();
        }}
      >
        <form
          onSubmit={(e) => {
            selectedEngagement != null && handleSubmit(e);
          }}
          className="h-full flex flex-col gap-6"
        >
          <div className="flex flex-col gap-6 pt-6">
            {/* Selected Customer */}
            <div className="flex flex-col gap-2">
              <p className="small text-black">Konsulenter</p>
              <ComboBox
                options={consultantOptions}
                selectedMultipleOptionsValue={selectedConsultants}
                onMultipleOptionsChange={setSelectedConsultants}
                isMultipleOptions={true}
                placeHolderText="Velg konsulenter"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="small text-black">Kunde</p>
              <ComboBox
                options={customerOptions}
                selectedSingleOptionValue={selectedCustomer}
                onSingleOptionChange={handleSelectedCustomerChange}
                isMultipleOptions={false}
                placeHolderText="Velg kunde"
                isDisabled={!selectedConsultants}
                isCreatable={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="small text-black">Engasjement</p>
              <ComboBox
                options={projectOptions}
                onSingleOptionChange={handleSelectedEngagementChange}
                selectedSingleOptionValue={selectedEngagement}
                isMultipleOptions={false}
                placeHolderText="Velg engasjement"
                isDisabled={selectedCustomer == null}
                isCreatable={true}
              />
            </div>

            {!isAbsence && (
              <>
                {/* Radio Button Group */}

                <div
                  className={`flex flex-row gap-4 ${
                    selectedEngagement == null && "hidden"
                  }`}
                >
                  <label className="flex gap-2 normal items-center">
                    <input
                      type="radio"
                      value={EngagementState.Offer}
                      checked={radioValue === EngagementState.Offer}
                      onChange={handleRadioChange}
                      disabled={selectedCustomer?.value == -1}
                    />
                    Tilbud
                  </label>
                  <label className="flex gap-2 normal items-center">
                    <input
                      type="radio"
                      value={EngagementState.Order}
                      checked={radioValue === EngagementState.Order}
                      onChange={handleRadioChange}
                      disabled={isAbsence}
                    />
                    Ordre
                  </label>
                </div>
                {/* Toggle (Checkbox) */}
                <label
                  className={`flex flex-row justify-between items-center normal ${
                    selectedEngagement == null && "hidden"
                  }`}
                >
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
              </>
            )}
          </div>

          <ActionButton
            variant="primary"
            fullWidth
            type="submit"
            disabled={selectedEngagement == null}
          >
            Legg til engasjement
          </ActionButton>
        </form>
      </EasyModal>
    </>
  );
}

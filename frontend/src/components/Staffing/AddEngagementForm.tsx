import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import ComboBox, { SelectOption } from "@/components/ComboBox";
import {
  ConsultantReadModel,
  EngagementState,
  EngagementWriteModel,
  ProjectWithCustomerModel,
} from "@/api-types";
import { usePathname } from "next/navigation";
import ActionButton from "../Buttons/ActionButton";
import FilterButton from "../Buttons/FilterButton";
import { Plus } from "react-feather";
import { CustomerModal } from "./CustomerModal";

export function AddEngagementForm({
  closeEngagementModal,
  consultant,
  onCancel,
}: {
  closeEngagementModal: (project: ProjectWithCustomerModel) => void;
  consultant: ConsultantReadModel;
  onCancel?: () => void;
}) {
  const { customers, setIsDisabledHotkeys } = useContext(FilteredContext);

  const organisationName = usePathname().split("/")[1];
  // State for select components
  const [selectedCustomer, setSelectedCustomer] = useState<SelectOption | null>(
    null,
  );
  const [selectedEngagement, setSelectedEngagement] = useState<
    SelectOption | null | undefined
  >(undefined);

  const [_, setProject] = useState<ProjectWithCustomerModel | undefined>();
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<SelectOption[]>([]);
  const [projectOptions, setProjectOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    setCustomerOptions(
      customers.map(
        (c) =>
          ({
            value: `${c.customerId}`,
            label: `${c.customerName}`,
          }) as SelectOption,
      ),
    );
  }, [customers]);

  useEffect(() => {
    const disabledProjectIds = consultant.detailedBooking.map(
      (b) => b.bookingDetails.projectId,
    );

    const customer = customers.find(
      (c) => c.customerId == selectedCustomer?.value,
    );

    if (!customer) {
      setProjectOptions([]);
      return;
    }

    const projectOptions: SelectOption[] = customer.engagements.reduce(
      (sum: SelectOption[], project) => {
        if (sum.map((p) => p?.label).includes(project.engagementName)) {
          return sum;
        }

        return [
          ...sum,
          {
            value: `${project.engagementId}`,
            label: `${project.engagementName}`,
            disabled: disabledProjectIds.includes(project.engagementId),
          },
        ];
      },
      [],
    );

    setProjectOptions(projectOptions);
  }, [customers, selectedCustomer, consultant]);

  // State for radio button group
  const [radioValue, setRadioValue] = useState(EngagementState.Offer);

  // State for toggle
  const [isBillable, setIsBillable] = useState<boolean>(true);

  // Hardcoded, based on ID from backend. Hopefully we can find a more graceful solution in the future
  const isAbsence = selectedCustomer?.value == -1;

  function customerExists(projectName: string | undefined): boolean {
    if (!projectName) return false;

    return customers
      .map((o) => o.customerName.toLowerCase())
      .includes(projectName.toLowerCase());
  }

  function engagementExists(engagementName: string | undefined): boolean {
    if (!engagementName) return false;

    return projectOptions
      .map((o) => o.label.toLowerCase())
      .includes(engagementName.toLowerCase());
  }

  // Handler for select components
  function handleSelectedCustomerChange(newCustomer: SelectOption) {
    setSelectedCustomer(newCustomer);
    setSelectedEngagement(null);

    if (!customerExists(newCustomer.label)) {
      setModalOpen(true);
    }
  }

  function handleSelectedEngagementChange(newValue: SelectOption) {
    setSelectedEngagement(newValue);
    if (!engagementExists(newValue.label)) {
      setIsNewProject(true);
      setModalOpen(true);
    }
  }

  // Handler for radio button group
  function handleRadioChange(event: ChangeEvent<HTMLInputElement>) {
    setRadioValue(event.target.value as EngagementState);
  }

  // Handler for toggle
  function handleToggleChange() {
    setIsBillable(!isBillable);
  }

  async function submitAddEngagementForm(body: EngagementWriteModel) {
    const url = `/${organisationName}/bemanning/api/projects`;
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
      isBillable,
    };

    const result = await submitAddEngagementForm(body);

    // TODO: This is a simplified mockup.
    if (result) {
      setProject(result);
      closeEngagementModal(result);
      setIsDisabledHotkeys(true);
      resetSelectedValues();

      // TODO: Futher logic for the changes in openModal *here*
    } else console.error("Error adding engagement");
    // TODO: #370 - Error handling for snackbars here
  }

  function resetSelectedValues() {
    setSelectedCustomer(null);
    setSelectedEngagement(null);
    setRadioValue(EngagementState.Offer);
    setIsBillable(true);
  }

  function handleCustomerAdded(newCustomer: EngagementWriteModel) {
    const existingCustomer = customerOptions.find(
      (c) => c.label === newCustomer.customerName,
    );
    const existingProject = projectOptions.find(
      (p) => p.label === newCustomer.projectName,
    );

    setSelectedCustomer(
      existingCustomer || {
        value: `${newCustomer.customerName}`,
        label: `${newCustomer.customerName}`,
      },
    );

    if (newCustomer?.projectName) {
      setSelectedEngagement(
        existingProject || {
          value: `${newCustomer.projectName}`,
          label: `${newCustomer.projectName}`,
        },
      );
    }

    setIsNewProject(!existingProject);
    setModalOpen(false);
  }

  function handleModalClose() {
    setModalOpen(false);

    if (!customerExists(selectedCustomer?.label)) {
      setSelectedCustomer(null);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // Needed to prevent keystrokes from triggering filters
    event.stopPropagation();

    if (event.key === "Escape") {
      handleModalClose();
    }
  }

  return (
    <div
      className="flex flex-row gap-2 items-center py-3"
      onKeyDown={handleKeyDown}
    >
      <CustomerModal
        open={modalOpen}
        onClose={handleModalClose}
        onCreate={handleCustomerAdded}
        customer={customers.find(
          (c) => c.customerName === selectedCustomer?.label,
        )}
        initialValues={{
          customerName: selectedCustomer?.label || "",
          projectName: selectedEngagement?.label || "",
        }}
      />
      <form
        onSubmit={(e) => {
          selectedEngagement != null && handleSubmit(e);
        }}
        className="flex flex-col gap-6 items-center"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <ComboBox
                options={customerOptions}
                selectedSingleOptionValue={selectedCustomer}
                onSingleOptionChange={handleSelectedCustomerChange}
                isMultipleOptions={false}
                placeHolderText="Kunde"
                width={190}
                isCreatable={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <ComboBox
                options={projectOptions}
                onSingleOptionChange={handleSelectedEngagementChange}
                selectedSingleOptionValue={selectedEngagement}
                isMultipleOptions={false}
                placeHolderText="Engasjement"
                isDisabled={selectedCustomer == null}
                width={190}
                isCreatable={true}
              />
            </div>
          </div>

          {isNewProject && (
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
                    className="accent-primary h-4 w-4 mx-[1px]"
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
                    className="accent-primary h-4 w-4 mx-[1px]"
                    value={EngagementState.Order}
                    checked={radioValue === EngagementState.Order}
                    onChange={handleRadioChange}
                    disabled={isAbsence}
                  />
                  Ordre
                </label>
              </div>
              <FilterButton
                label="Fakturerbart"
                onClick={handleToggleChange}
                checked={isBillable}
              />
            </>
          )}
        </div>

        <div className="flex gap-3">
          {consultant && onCancel && (
            <ActionButton
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Avbryt
            </ActionButton>
          )}
          <ActionButton
            variant="primary"
            fullWidth
            type="submit"
            iconLeft={<Plus size="20" />}
            disabled={selectedEngagement == null || isSubmitting}
            className="py-0"
          >
            Legg til
          </ActionButton>
        </div>
      </form>
    </div>
  );
}

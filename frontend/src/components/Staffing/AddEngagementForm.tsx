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
import { Plus } from "react-feather";
import FilterButton from "../Buttons/FilterButton";

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
  const [isInternalProject, setIsInternalProject] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [bookingType, setBookingType] = useState(EngagementState.Offer);

  // State for toggle
  const [isBillable, setIsBillable] = useState<boolean>(true);

  // Hardcoded, based on ID from backend. Hopefully we can find a more graceful solution in the future
  const isAbsence = selectedCustomer?.value == -1;

  function projectExists(projectName: string | undefined): boolean {
    if (!projectName) return false;

    return projectOptions
      .map((o) => o.label.toLowerCase())
      .includes(projectName.toLowerCase());
  }

  function isOwnCompany(customerName: string | undefined): boolean {
    if (!customerName || !organisationName) return false;

    return (
      customerName.toLowerCase() ===
      organisationName.split("-")[0].toLowerCase()
    );
  }

  function isProjectBillable(projectName: string | undefined): boolean {
    if (!projectName) return false;

    const customer = customers.find(
      (c) => c.customerId == selectedCustomer?.value,
    );

    return (
      customer?.engagements.find((e) => e.engagementName == projectName)
        ?.isBillable || false
    );
  }

  function handleSelectedEngagementChange(newValue: SelectOption) {
    setSelectedEngagement(newValue);

    if (!projectExists(newValue.label)) {
      setIsNewProject(true);
      return;
    }

    setIsBillable(isProjectBillable(newValue.label));
  }

  // Handler for select components
  function handleSelectedCustomerChange(newCustomer: SelectOption) {
    const internalProject = isOwnCompany(newCustomer.label);

    setIsInternalProject(internalProject);
    setIsNewProject(false);
    setSelectedCustomer(newCustomer);
    setIsBillable(!internalProject);
    setSelectedEngagement(null);
    setBookingType(internalProject ? EngagementState.Order : bookingType);
  }

  // Handler for radio button group
  function handleRadioChange(event: ChangeEvent<HTMLInputElement>) {
    setBookingType(event.target.value as EngagementState);
  }

  function handleBillableToggled() {
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
      bookingType: isAbsence ? EngagementState.Absence : bookingType,
      isBillable: isAbsence ? false : isBillable,
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
    setBookingType(EngagementState.Offer);
    setIsBillable(true);
  }

  const isOfferOptionDisabled =
    selectedCustomer?.value == -1 || isInternalProject;
  const isOrderOptionDisabled = isAbsence || isInternalProject;

  return (
    <div className="flex flex-row gap-2 items-center py-3">
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
                isCreatable={!isAbsence}
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
                <label
                  className={`flex gap-2 normal items-center ${
                    isOfferOptionDisabled && "text-black/50"
                  }`}
                >
                  <input
                    type="radio"
                    className="accent-primary h-4 w-4 mx-[1px]"
                    value={EngagementState.Offer}
                    checked={bookingType === EngagementState.Offer}
                    onChange={handleRadioChange}
                    disabled={isOfferOptionDisabled}
                  />
                  Tilbud
                </label>
                <label
                  className={`flex gap-2 normal items-center ${
                    isOrderOptionDisabled && "text-black/50"
                  }`}
                >
                  <input
                    type="radio"
                    className="accent-primary h-4 w-4 mx-[1px]"
                    value={EngagementState.Order}
                    checked={bookingType === EngagementState.Order}
                    onChange={handleRadioChange}
                    disabled={isOrderOptionDisabled}
                  />
                  Ordre
                </label>
              </div>
              <FilterButton
                label="Fakturerbart"
                onClick={handleBillableToggled}
                checked={isBillable}
                enabled={!isInternalProject}
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

import { ConsultantReadModel } from "@/api-types";
import { RefObject, ReactElement, useState, FormEvent } from "react";
import ActionButton from "../Buttons/ActionButton";
import EasyModal from "../Modals/EasyModal";
import ComboBox, { SelectOption } from "../ComboBox";
import { Plus } from "react-feather";

interface AddConsultantModalProps {
  closeConsultantModal: () => void;
  easyModalRef: RefObject<HTMLDialogElement>;
  onAddConsultant: (option: SelectOption) => void;
  consultantList: ConsultantReadModel[];
  closeAddConsultant: () => void;
}

export function AddConsultantModal(
  props: AddConsultantModalProps,
): ReactElement {
  // const { consultants } = useContext(FilteredContext);
  const { closeConsultantModal, easyModalRef, closeAddConsultant } = props;

  const consultantOptions =
    props.consultantList.map(
      (c) =>
        ({
          value: `${c.id}`,
          label: `${c.name}`,
        }) as SelectOption,
    ) ?? [];

  const [selectedConsultant, setSelectedConsultant] =
    useState<SelectOption | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Needed to prevent the form from refreshing the page
    event.preventDefault();
    event.stopPropagation();

    props.onAddConsultant(selectedConsultant!);

    // Cleanup
    setSelectedConsultant(null);
    closeConsultantModal();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-2 pt-3">
        <ComboBox
          options={consultantOptions}
          selectedSingleOptionValue={selectedConsultant}
          onSingleOptionChange={setSelectedConsultant}
          isMultipleOptions={false}
          width={228}
        />
      </div>
      <div className="flex gap-3">
        <ActionButton
          variant="secondary"
          onClick={() => {
            closeAddConsultant();
          }}
          className=""
        >
          Avbryt
        </ActionButton>
        <ActionButton
          variant="primary"
          disabled={!selectedConsultant}
          fullWidth
          type="submit"
          iconLeft={<Plus size="20" />}
          onClick={() => {}}
          className=""
        >
          Legg til
        </ActionButton>
      </div>
    </form>
  );
}

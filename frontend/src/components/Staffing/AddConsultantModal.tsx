import { Consultant } from "@/types";
import { RefObject, ReactElement, useState, FormEvent } from "react";
import ActionButton from "../Buttons/ActionButton";
import EasyModal from "../Modals/EasyModal";
import ReactSelect, { SelectOption } from "../ReactSelect";

interface AddConsultantModalProps {
  closeConsultantModal: () => void;
  easyModalRef: RefObject<HTMLDialogElement>;
  onAddConsultant: (option: SelectOption) => void;
  consultantList: Consultant[];
}

export function AddConsultantModal(
  props: AddConsultantModalProps,
): ReactElement {
  // const { consultants } = useContext(FilteredContext);
  const { closeConsultantModal, easyModalRef } = props;

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
    <EasyModal
      modalRef={easyModalRef}
      classNames="bg-white overflow-visible z-50"
      title={"Legg til konsulent"}
      showCloseButton
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 pt-6 h-32">
          <ReactSelect
            options={consultantOptions}
            selectedSingleOptionValue={selectedConsultant}
            onSingleOptionChange={setSelectedConsultant}
            isMultipleOptions={false}
          />
        </div>
        <ActionButton
          variant="primary"
          disabled={!selectedConsultant}
          fullWidth
          type="submit"
          onClick={() => {}}
        >
          Lagre
        </ActionButton>
      </form>
    </EasyModal>
  );
}

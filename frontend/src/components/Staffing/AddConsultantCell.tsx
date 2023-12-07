import React, {
  FormEvent,
  ReactElement,
  RefObject,
  useContext,
  useState,
} from "react";
import { Plus } from "react-feather";
import ReactSelect, { SelectOption } from "@/components/ReactSelect";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useModal } from "@/hooks/useModal";
import EasyModal from "../Modals/EasyModal";
import ActionButton from "../Buttons/ActionButton";

export function AddConsultantCell(props: {
  onAddConsultant: (option: SelectOption) => void;
}): ReactElement {
  const [isAddStaffingHovered, setIsAddConsultantHovered] = useState(false);

  const { closeModal, openModal, modalRef } = useModal({
    closeOnBackdropClick: false,
  });

  return (
    <>
      <td className={`${"border-l-secondary border-l-2"}`}></td>
      <td>
        <AddConsultantModal
          closeConsultantModal={closeModal}
          easyModalRef={modalRef}
          onAddConsultant={props.onAddConsultant}
        />
        <button
          onClick={openModal}
          className="flex flex-row items-center gap-2"
          onMouseEnter={() => setIsAddConsultantHovered(true)}
          onMouseLeave={() => setIsAddConsultantHovered(false)}
        >
          <span
            className={`w-8 h-8 flex justify-center items-center rounded bg-primary/0 ${
              isAddStaffingHovered && "bg-primary/10"
            }`}
          >
            <Plus size={16} className="text-primary" />
          </span>

          <p className="small text-primary">Legg til konsulent</p>
        </button>
      </td>
    </>
  );
}

interface AddConsultantModalProps {
  closeConsultantModal: () => void;
  easyModalRef: RefObject<HTMLDialogElement>;
  onAddConsultant: (option: SelectOption) => void;
}

function AddConsultantModal(props: AddConsultantModalProps): ReactElement {
  const { consultants } = useContext(FilteredContext);
  const { closeConsultantModal, easyModalRef } = props;

  const consultantOptions =
    consultants.map(
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

import React, { FormEvent, useEffect, useRef } from "react";
import EasyModal from "../Modals/EasyModal";
import ActionButton from "../Buttons/ActionButton";
import { Plus } from "react-feather";
import {
  EngagementPerCustomerReadModel,
  EngagementWriteModel,
} from "@/api-types";
import { useModal } from "@/hooks/useModal";

interface CustomerModalProps {
  open: boolean;
  customer?: EngagementPerCustomerReadModel;
  onClose: () => void;
  onCreate: (customer: EngagementWriteModel) => void;
  initialValues?: EngagementWriteModel;
}

export function CustomerModal({
  open,
  onClose,
  onCreate,
  customer,
  initialValues,
}: CustomerModalProps) {
  const customerRef = useRef<HTMLInputElement>(null);
  const engagementRef = useRef<HTMLInputElement>(null);

  const { closeModal, openModal, modalRef } = useModal({
    closeOnBackdropClick: false,
  });

  const [formData, setFormData] = React.useState<EngagementWriteModel>({
    customerName: initialValues?.customerName || "",
    projectName: initialValues?.projectName,
  });

  useEffect(() => {
    if (open) {
      openModal();
      if (customerRef?.current && !customer) {
        customerRef.current.focus();
      }

      if (engagementRef?.current && customer) {
        engagementRef.current.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (
      initialValues?.customerName !== formData.customerName ||
      initialValues?.projectName !== formData.projectName
    ) {
      setFormData({
        customerName: initialValues?.customerName || "",
        projectName: initialValues?.projectName,
      });
    }
  }, [initialValues]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Needed to prevent the form from refreshing the page
    event.preventDefault();
    event.stopPropagation();

    onCreate(formData);
    closeModal();
  }

  function onCustomerNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, customerName: event.target.value });
  }

  function onProjectNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, projectName: event.target.value });
  }

  function handleClose() {
    closeModal();
    onClose();
  }

  return (
    <EasyModal
      modalRef={modalRef}
      title=""
      classNames="bg-white overflow-visible z-50"
      onClose={handleClose}
      showCloseButton
    >
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="customer" className="text-sm">
              Kunde
            </label>
            <input
              id="customer"
              ref={customerRef}
              type="text"
              placeholder="Nytt kundenavn"
              value={formData?.customerName}
              required
              disabled={!!customer}
              autoFocus={!customer}
              onChange={onCustomerNameChanged}
              className="w-full h-10 py-1.5 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm text-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="engagement" className="text-sm">
              Engasjement
            </label>
            <input
              id="engagement"
              ref={engagementRef}
              type="text"
              placeholder="Engasjement"
              value={formData.projectName}
              autoFocus={!!customer}
              onChange={onProjectNameChanged}
              className="w-full h-10 py-1.5 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm text-primary"
            />
          </div>
        </div>
        <ActionButton
          variant={"primary"}
          className="w-full"
          type="submit"
          iconLeft={<Plus />}
        >
          Legg til
        </ActionButton>
      </form>
    </EasyModal>
  );
}

import { ConsultantReadModel, ConsultantWriteModel, Degree } from "@/api-types";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useParams } from "next/navigation";
import React, { useContext, useState } from "react";
import { Check, X } from "react-feather";
import Select, { MultiValue, SingleValue } from "react-select";

export default function AddNewConsultantModal({
  onClose,
}: {
  onClose: (res: ConsultantReadModel | null) => void;
}) {
  const [newConsultant, setNewConsultant] = useState<ConsultantWriteModel>({
    name: "",
    email: "",
    department: {
      id: "",
      name: "",
    },
    competences: [],
    degree: Degree.None,
    graduationYear: new Date().getFullYear(),
    startDate: new Date(),
  });
  const { competences, departments } = useContext(FilteredContext);
  const { organisation } = useParams();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (
      newConsultant.name === "" ||
      newConsultant.email === "" ||
      newConsultant.department.id === ""
    ) {
      return;
    }

    const createdConsultant = await fetch(
      `/${organisation}/konsulenter/api/consultant`,
      {
        method: "POST",
        body: JSON.stringify(newConsultant),
      },
    );
    const res = await createdConsultant.json();

    // Add your logic to handle form submission here
    // e.g. make an API call to save the consultant data
    // and then close the modal
    onClose(res);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 z-10 flex flex-col gap-5 w-96 rounded-md"
      >
        <button
          type="button"
          onClick={() => onClose(null)}
          className="w-fit self-end"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm">
            Navn
          </label>
          <input
            className="w-full h-10 py-1.5 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm text-primary"
            type="text"
            id="name"
            value={newConsultant.name}
            onChange={(e) => {
              setNewConsultant((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm">
            Mailadresse
          </label>
          <input
            className="w-full h-10 py-1.5 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm text-primary"
            type="text"
            id="email"
            value={newConsultant.email}
            onChange={(e) => {
              setNewConsultant((prev) => ({ ...prev, email: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="startdate" className="text-sm">
              Startdato
            </label>
            <input
              className="w-full h-10 py-1.5 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm text-primary"
              type="date"
              id="startdate"
              value={newConsultant.startDate.toISOString().split("T")[0]}
              onChange={(e) => {
                setNewConsultant((prev) => ({
                  ...prev,
                  startDate: new Date(e.target.value),
                }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="department" className="text-sm">
              Avdeling
            </label>
            <Select
              id="department"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused
                    ? "var(--primary, #423D89)"
                    : "var(--primary_50, #423D8980)",
                  padding: "0.05rem 0.2rem ",
                  fontSize: "0.875rem",
                  height: "40px",
                }),
              }}
              options={departments.map((dep) => ({
                value: dep.id,
                label: dep.name,
              }))}
              isMulti={false}
              defaultValue={{
                value: newConsultant.department.id,
                label: newConsultant.department.name,
              }}
              onChange={(
                selOptions: SingleValue<{ value: string; label: string }>,
              ) => {
                if (selOptions) {
                  setNewConsultant((prev) => ({
                    ...prev,
                    department: {
                      id: selOptions.value,
                      name: selOptions.label,
                    },
                  }));
                }
              }}
            />
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="degree" className="text-sm">
              Grad
            </label>
            <Select
              id="degree"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused
                    ? "var(--primary, #423D89)"
                    : "var(--primary_50, #423D8980)",
                  padding: "0.05rem 0.2rem ",
                  fontSize: "0.875rem",
                  height: "40px",
                }),
              }}
              options={Object.entries(Degree)
                .filter(([value]) => isNaN(Number(value)))
                .map(([value, label]) => ({
                  value: label.toString(),
                  label: value.toString(),
                }))}
              isMulti={false}
              defaultValue={{
                value: newConsultant.degree.toString(),
                label: Degree[newConsultant.degree],
              }}
              onChange={(
                selOptions: SingleValue<{ value: string; label: string }>,
              ) => {
                if (selOptions) {
                  setNewConsultant((prev) => ({
                    ...prev,
                    degree: Degree[selOptions.value as keyof typeof Degree],
                  }));
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="graduationYear" className="text-sm">
              Eksamensår
            </label>
            <Select
              id="graduationYear"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused
                    ? "var(--primary, #423D89)"
                    : "var(--primary_50, #423D8980)",
                  padding: "0.05rem 0.2rem ",
                  fontSize: "0.875rem",
                  height: "40px",
                }),
              }}
              options={Array.from(
                { length: 50 },
                (_, i) => new Date().getFullYear() - i,
              ).map((year) => ({
                value: year.toString(),
                label: year.toString(),
              }))}
              isMulti={false}
              defaultValue={{
                value: newConsultant.graduationYear.toString(),
                label: newConsultant.graduationYear.toString(),
              }}
              onChange={(
                selOptions: SingleValue<{ value: string; label: string }>,
              ) => {
                if (selOptions) {
                  setNewConsultant((prev) => ({
                    ...prev,
                    graduationYear: parseInt(selOptions.value),
                  }));
                }
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="competences" className="text-sm">
            Kompetanse
          </label>
          <Select
            styles={{
              valueContainer: (provided: any) => ({
                ...provided,

                maxHeight: "100px",
                overflow: "auto",
              }),
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused
                  ? "var(--primary, #423D89)"
                  : "var(--primary_50, #423D8980)",
                padding: "0.05rem 0.2rem ",
                fontSize: "0.875rem",
                minHeight: "40px",
              }),
            }}
            options={competences.map((comp) => ({
              value: comp.id,
              label: comp.name,
            }))}
            isMulti={true}
            defaultValue={newConsultant.competences.map((option) => ({
              value: option.id,
              label: option.name,
            }))}
            onChange={(
              selOptions: MultiValue<{ value: string; label: string }>,
            ) => {
              if (Array.isArray(selOptions)) {
                if (selOptions) {
                  setNewConsultant((prev) => ({
                    ...prev,
                    competences: selOptions.map((option) => ({
                      id: option.value,
                      name: option.label,
                    })),
                  }));
                }
              }
            }}
          />
        </div>

        <button
          type="submit"
          className="flex h-10 flex-row gap-2 justify-center bg-primary text-white py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary_50"
        >
          <Check size="24" /> Lagre
        </button>
      </form>
    </div>
  );
}

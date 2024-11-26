import CreatableSelect from "react-select/creatable";

export function EditSelect({
  value,
  name,
  label,
  options,
  inEdit,
  onChange,
  onClick,
}: {
  value?: string;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  inEdit: boolean;
  onChange: (value: string) => void;
  onClick?: (e?: any) => any;
}) {
  return (
    <div className="mb-4 pr-4">
      <label
        htmlFor={name}
        className={`block text-sm font-medium ${
          inEdit ? " p-2" : "px-2"
        } text-gray-700`}
      >
        {label}
      </label>
      {inEdit ? (
        <CreatableSelect
          id={name}
          name={name}
          value={options.find((option) => option.value === value)}
          onChange={(selectedOption) => onChange(selectedOption?.value || "")}
          defaultInputValue={value}
          options={options}
          className="mt-1 block w-full"
          isClearable
        />
      ) : (
        <p
          className="mt-1 bg-primary/5 shadow-sm border border-primary/5 pr-10 p-2 rounded-md w-full "
          onClick={onClick}
        >
          {value ? value : "Ingen"}
        </p>
      )}
    </div>
  );
}

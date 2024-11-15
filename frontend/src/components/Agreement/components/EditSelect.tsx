import CreatableSelect from "react-select/creatable";

export function EditSelect({
  value,
  name,
  label,
  options,
  inEdit,
  onChange,
}: {
  value?: string;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  inEdit: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-4 pr-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 "
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
        <p>{value}</p>
      )}
    </div>
  );
}

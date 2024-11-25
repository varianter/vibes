export function EditDateInput({
  value,
  name,
  label,
  inEdit,
  required = false,
  onClick,
}: {
  value: Date | null;
  name: string;
  label: string;
  inEdit: boolean;
  required?: boolean;
  onClick?: (e?: any) => any;
}) {
  return (
    <div className="mb-4 pr-4">
      {inEdit ? (
        <>
          <label
            htmlFor={label}
            className="block text-sm p-2 font-medium text-gray-700"
          >
            {label}
          </label>
          <input
            id={name + label}
            name={name}
            aria-label={label}
            required={required}
            defaultValue={
              value ? new Date(value).toISOString().split("T")[0] : undefined
            }
            type="date"
            className="border-one_and_a_half shadow-sm border-primary rounded-md px-2 pt-1 mt-1 block w-full"
          />
        </>
      ) : (
        <>
          <label
            htmlFor={label}
            className="block  px-2 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <p
            onClick={onClick}
            className="mt-1 bg-primary/5 shadow-sm border border-primary/5 pr-10 p-2 rounded-md hover:bg-primary_darker/10"
          >
            {value ? new Date(value).toLocaleDateString() : ""}
          </p>
        </>
      )}
    </div>
  );
}

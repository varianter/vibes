export function EditDateInput({
  value,
  name,
  label,
  inEdit,
  required = false,
}: {
  value: Date | null;
  name: string;
  label: string;
  inEdit: boolean;
  required?: boolean;
}) {
  return (
    <div className="mb-4 pr-4">
      {inEdit ? (
        <>
          <label
            htmlFor={label}
            className="block text-sm font-medium text-gray-700"
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
            className="border border-gray-300 rounded-md p-1 mt-1 block w-full"
          />
        </>
      ) : (
        <>
          <label
            htmlFor={label}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <p className="mt-1">
            {value ? new Date(value).toLocaleDateString() : ""}
          </p>
        </>
      )}
    </div>
  );
}

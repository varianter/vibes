export function EditInput({
  value,
  name,
  label,
  inEdit,
}: {
  value?: string;
  name: string;
  label: string;
  inEdit: boolean;
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
            defaultValue={value}
            type="text"
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
          <p className="mt-1">{value}</p>
        </>
      )}
    </div>
  );
}

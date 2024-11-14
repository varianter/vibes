export function EditTextarea({
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
          <textarea
            id={name + label}
            rows={5}
            cols={50}
            name={name}
            defaultValue={value}
            aria-label={label}
            className="border border-gray-300 rounded-md p-1 mt-1 block w-full"
          />
        </>
      ) : (
        <>
          {value ? (
            <label
              htmlFor={label}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
          ) : null}

          <p className="mt-1">{value}</p>
        </>
      )}
    </div>
  );
}

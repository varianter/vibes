export function EditTextarea({
  value,
  name,
  label,
  inEdit,
  onClick,
}: {
  value?: string;
  name: string;
  label: string;
  inEdit: boolean;
  onClick?: (e?: any) => any;
}) {
  return (
    <div className="mb-7 pr-4">
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
            className="border-2 border-primary rounded-md p-1 mt-1 block w-full"
          />
        </>
      ) : (
        <>
          <label
            htmlFor={label}
            className="block text-sm px-2 font-bold text-gray-700"
          >
            {label}
          </label>

          {value ? (
            <p onClick={onClick} className="mt-1 px-2">
              {value}
            </p>
          ) : (
            <p
              onClick={onClick}
              className="mt-1 px-2 italic text-text_light_black/50"
            >
              {"Legg til tekst her"}
            </p>
          )}
        </>
      )}
    </div>
  );
}

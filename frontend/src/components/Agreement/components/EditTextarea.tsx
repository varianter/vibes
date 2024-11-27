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
            className="block text-sm font-medium pl-2 text-gray-700"
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
            className="border-one_and_a_half border-primary/80 rounded-md p-2 mt-1 block w-full focus:outline-none focus:bg-primary/10 transitionEase"
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
            <div>
              {value.split(/\r?\n/).map((line, index) => (
                <p
                  onClick={onClick}
                  className="mt-1 px-2 hover:cursor-pointer"
                  key={index}
                >
                  {line}
                </p>
              ))}
            </div>
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

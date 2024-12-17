import { format } from "date-fns";
import { on } from "events";
import { set } from "lodash";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!inEdit) {
      setClicked(false);
    }
  }, [inEdit]);

  function onInputClick(e: any) {
    setClicked(true);
    if (onClick) onClick(e);
  }

  useLayoutEffect(() => {
    if (inEdit && inputRef.current && clicked) {
      inputRef.current.focus();
      inputRef.current.showPicker();
    }
  }, [inEdit, clicked]);

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
            ref={inputRef}
            name={name}
            aria-label={label}
            required={required}
            defaultValue={value ? format(value!, "yyyy-MM-dd") : undefined}
            type="date"
            className="border-one_and_a_half shadow-sm border-primary rounded-md px-2 pt-1 mt-1 block w-full "
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
            onClick={(e) => onInputClick(e)}
            className={`mt-1 bg-primary/5 shadow-sm border border-primary/5 pr-10 p-2 rounded-md hover:bg-primary_darker/10  ${
              value ? "" : "text-text_light_black/50 italic"
            }`}
          >
            {value?.toLocaleDateString("nb-NO") ?? "Ikke satt"}
          </p>
        </>
      )}
    </div>
  );
}

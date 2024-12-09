import InfoPill from "@/components/Staffing/InfoPill";
import { Edit2 } from "react-feather";

export function EditInput({
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
    <div className="mb-3 pr-4 mt-2 h-16">
      {inEdit ? (
        <>
          <label
            htmlFor={label}
            className="block text-sm pl-2 font-medium text-gray-700"
          >
            {label}
          </label>
          <input
            id={name + label}
            name={name}
            aria-label={label}
            defaultValue={value}
            type="text"
            className="shadow-sm w-full border-one_and_a_half border-primary focus:outline-none focus:bg-primary/10 transitionEase bg-white rounded-md mr-10 pr-10 p-2 mt-1 block"
          />
        </>
      ) : (
        <>
          <h2
            className="mr-10 pr-10 p-2 mt-1 block text-sm font-bold pl-2 text-gray-700 hover:cursor-pointer"
            onClick={onClick}
          >
            {value}
          </h2>
        </>
      )}
    </div>
  );
}

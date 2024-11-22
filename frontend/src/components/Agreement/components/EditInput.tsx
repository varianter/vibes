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
    <div className="mb-5 pr-4 mt-2">
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
            className="shadow-sm w-full border-2 border-primary focus:outline-primary active:outline-primary bg-white rounded-md mr-10 pr-10 p-2 mt-1 block"
          />
        </>
      ) : (
        <>
          <h2 className="block text-sm font-bold pl-2 text-gray-700">
            {value}
          </h2>
        </>
      )}
    </div>
  );
}

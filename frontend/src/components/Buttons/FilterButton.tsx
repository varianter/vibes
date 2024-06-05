export default function FilterButton({
  label,
  rounded,
  ...inputProps
}: {
  label: string;
  rounded?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center" onClick={inputProps.onClick}>
      <input
        type="checkbox"
        aria-labelledby={label.replaceAll(/ /g, "-")}
        disabled={inputProps.disabled}
        readOnly
        {...inputProps}
        className={`appearance-none border flex items-center border-opacity-50 m-[1px] mr-2 h-4 w-4  border-primary hover:border-primary checked:bg-primary
          ${inputProps.disabled &&
          "border-black/20 hover:border-black/20 checked:bg-primary/50 bg-black/5"
          }
          ${inputProps.checked
            ? "hover:bg-primary hover:brightness-[1.5]"
            : "hover:bg-primary hover:bg-opacity-10"
          }
          ${rounded ? "rounded-full" : "rounded-sm"}
          `}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={`absolute ml-[3px] pointer-events-none ${!inputProps.checked && "hidden"
          }`}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.3536 2.64645C10.5488 2.84171 10.5488 3.15829 10.3536 3.35355L4.85355 8.85355C4.65829 9.04882 4.34171 9.04882 4.14645 8.85355L1.64645 6.35355C1.45118 6.15829 1.45118 5.84171 1.64645 5.64645C1.84171 5.45118 2.15829 5.45118 2.35355 5.64645L4.5 7.79289L9.64645 2.64645C9.84171 2.45118 10.1583 2.45118 10.3536 2.64645Z"
          fill="white"
        />
      </svg>
      <label
        id={label.replaceAll(/ /g, "-")}
        className={`normal select-none ${inputProps.disabled && "text-black/50"
          }`}
      >
        {label}
      </label>
    </div>
  );
}

export default function FilterButton({
  label,
  rounded,
  ...inputProps
}: {
  label: string;
  rounded?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2" onClick={inputProps.onClick}>
      <input
        type="checkbox"
        aria-labelledby={label.replaceAll(/ /g, "-")}
        disabled={inputProps.disabled}
        readOnly
        {...inputProps}
        className={`checkBoxWithCustomCheckmark border flex items-center border-opacity-50 m-[1px] mr-2 h-4 w-4  border-primary hover:border-primary
          
          ${
            inputProps.checked
              ? "hover:bg-primary hover:brightness-[1.5]"
              : "hover:bg-primary hover:bg-opacity-10"
          }
          ${rounded ? "rounded-full" : "rounded-sm"} ${
            inputProps.disabled &&
            "border-black/20 bg-black/5 pointer-events-none checked:bg-primary checked:bg-opacity-50"
          }
          `}
      />
      <label
        id={label.replaceAll(/ /g, "-")}
        className={`normal select-none ${
          inputProps.disabled && "text-black/50"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

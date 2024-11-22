/**
 * @param buttonText: the text for the button.
 * @param className: a string containing additional styling one wants to apply to the button. Default styling is primary button styling.
 * NB: If you apply the className attribute, make sure to apply border color, background color and text color.
 * @returns a button with the text buttonText.
 */
export function AgreementButton({
  buttonText,
  className,
  type,
  onClick,
}: {
  buttonText: string;
  className?: string;
  type: "button" | "submit" | "reset" | undefined;
  onClick?: (e?: any) => any;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`border shadow-md font-semibold py-2 px-4 rounded-md w-fit ${
        className ? className : "border-primary-darker bg-primary text-white "
      }`}
    >
      {buttonText}
    </button>
  );
}

export default function PrimaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="normal-semibold px-2 py-3 bg-primary rounded-lg text-white"
      onClick={onClick}
    >
      <p className={"hover:brightness-150"}>{label}</p>
    </button>
  );
}

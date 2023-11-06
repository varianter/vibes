export default function SecondaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="interaction-button py-3 px-2 rounded-lg border border-primary_l1  hover:bg-primary_default hover:border-primary_default hover:bg-opacity-10 text-primary_default"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

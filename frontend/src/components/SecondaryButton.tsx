export default function SecondaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="normal-semibold p-3 rounded-lg border border-primary/50  hover:bg-primary hover:border-primary hover:bg-opacity-10 text-primary"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

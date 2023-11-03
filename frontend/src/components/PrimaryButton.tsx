export default function PrimaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="h-10 p-3 bg-primary_default rounded-lg justify-center items-center gap-2 inline-flex text-white text-sm leading-none"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

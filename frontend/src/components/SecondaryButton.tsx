export default function SecondaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="h-10 p-3 rounded-lg border border-primary_l1 justify-center items-center gap-2 inline-flex hover:bg-primary_default hover:border-primary_default hover:bg-opacity-10"
      onClick={onClick}
    >
      <div className=" text-primary_default text-sm font-semibold leading-none">
        {label}
      </div>
    </button>
  );
}

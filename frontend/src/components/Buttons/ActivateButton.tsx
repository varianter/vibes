import BaseButton from "./BaseButton";

export default function ActivateButton({
  mode,
  onClick,
  children,
}: {
  mode: "activate" | "deactivate";
  onClick?: () => any;
  children?: React.ReactNode;
}) {
  const styling = {
    activate: " border-2 border-activate/50 hover:border-activate",
    deactivate: " border-2 border-deactivate/50 hover:border-deactivate",
  }[mode];
  return (
    <BaseButton
      onClick={() => onClick && onClick()}
      className={` text-primary bg-white border py-2 w-20 rounded-md flex flex-row items-center gap-2 shadow-sm ${styling}`}
    >
      {children}
    </BaseButton>
  );
}

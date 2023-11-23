import RightCloseButton from "../RightCloseButton";

export function EasyModalHeader({
  showCloseButton,
  title,
  handleClose,
}: {
  title: string;
  handleClose: () => void;
  showCloseButton?: true;
}) {
  return (
  <div className="flex flex-row justify-between items-center">
      <h2>{title}</h2>
      {showCloseButton && <RightCloseButton onClick={handleClose} />}
    </div>
  );
}

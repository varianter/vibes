import { X } from "react-feather";
import IconActionButton from "../Buttons/IconActionButton";

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
      {showCloseButton && (
        <IconActionButton
          onClick={handleClose}
          variant={"terniary"}
          icon={<X />}
        />
      )}
    </div>
  );
}

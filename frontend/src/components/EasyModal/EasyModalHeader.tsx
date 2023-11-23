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
    <div className="w-full h-10 justify-between items-center inline-flex">
      <div className="p-2 text-zinc-800 text-xl font-normal leading-normal">
        <h2>{title}</h2>
      </div>
      {showCloseButton && (
        <div className="p-2 rounded-lg justify-center items-center gap-2 flex">
          <RightCloseButton onClick={handleClose} />
        </div>
      )}
    </div>
  );
}

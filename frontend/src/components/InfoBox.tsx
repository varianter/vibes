export default function InfoBox({
  infoName,
  infoValue,
}: {
  infoName: string;
  infoValue: string | undefined;
}) {
  return (
    <div className="bg-primary/5 rounded-xl p-3 flex flex-col gap-2">
      <p className="small text-black">{infoName}</p>
      <p className="normal-semibold text-black">{infoValue}</p>
    </div>
  );
}

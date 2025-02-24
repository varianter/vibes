import { Skeleton } from "@/components/Skeleton";

type Props = {
  infoName: string;
  infoValue: string | undefined;
  isLoading?: boolean;
};

export default function InfoBox({ infoName, infoValue, isLoading }: Props) {
  return (
    <div className="bg-primary/5 rounded-xl p-3 flex flex-col gap-2">
      <p className="small text-black">{infoName}</p>
      {isLoading || infoValue === undefined ? (
        <Skeleton className="h-4 w-8" />
      ) : (
        <p className="normal-semibold text-black">{infoValue}</p>
      )}
    </div>
  );
}

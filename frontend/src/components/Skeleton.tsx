import { cn } from "@/utils/classNames";

type Props = {
  className?: string;
  rounded?: boolean;
};

export function Skeleton({ className, rounded }: Props) {
  return (
    <div
      className={cn(
        "animate-pulse bg-skeleton w-full h-full",
        rounded ? "rounded-full" : "rounded-md",
        className,
      )}
    />
  );
}

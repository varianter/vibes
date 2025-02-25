import { Fragment } from "react";
import { Skeleton } from "../Skeleton";

function StaffingSkeleton({ weekSpan }: { weekSpan: number }) {
  const numbers = Array.from({ length: 50 }, (_, i) => i + 1);
  const numberOfTds = Array.from({ length: weekSpan }, (_, i) => i + 1);
  return (
    <div className="mt-14">
      <div
        style={{ gridTemplateColumns: `1.65fr repeat(${weekSpan}, 1fr)` }}
        className="grid gap-[4px]"
      >
        {numbers.map((number) => (
          <Fragment key={number}>
            <div className="flex gap-1 border-l-2 border-l-primary/5">
              <div className="w-14"></div>
              <Skeleton className="w-12 h-12" />
              <div className="flex flex-col gap-1 pt-0.5">
                <Skeleton className="h-3 w-16 rounded-[4px]" />
                <Skeleton className="h-3 w-10 rounded-[4px]" />
              </div>
            </div>
            {numberOfTds.map((num) => (
              <Skeleton key={num + 100} className="" />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export { StaffingSkeleton };

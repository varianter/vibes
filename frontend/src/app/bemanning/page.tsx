"use client";
import VariantListElement from "@/components/variantListElement";
import useVibesApi from "@/hooks/useVibesApi";
import { CircularProgress } from "@mui/material";

export default function Bemanning() {
  const { data, isLoading } = useVibesApi(true);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (data) {
    return (
      <div>
        <h1>Konsulenter</h1>

        <div className="flex flex-row gap-3 pt-16 pb-4 items-center">
          <p className="body-large-bold ">Konsulentliste</p>

          <div className="rounded-full bg-black bg-opacity-5 px-2 py-1">
            <p className="text-black body-small">{data.length}</p>
          </div>
        </div>
        {data.map((variant) => (
          <VariantListElement key={variant.id} variant={variant} />
        ))}
      </div>
    );
  }
}

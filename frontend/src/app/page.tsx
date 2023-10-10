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

        <p className="body-large-bold pt-16 pb-4">Konsulentliste</p>
        {data.map((variant) => (
          <VariantListElement key={variant.id} variant={variant} />
        ))}
      </div>
    );
  }
}

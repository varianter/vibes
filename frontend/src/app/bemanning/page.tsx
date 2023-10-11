"use client";

import FilteredVariantList from "@/components/FilteredVariantList";
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
        <FilteredVariantList variants={data} />
      </div>
    );
  }
}

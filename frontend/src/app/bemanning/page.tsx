"use client";

import FilteredConsultantsList from "@/components/FilteredConsultantsList";
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
        <FilteredConsultantsList consultants={data} />
      </div>
    );
  }
}

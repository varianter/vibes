import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import { getConsultants } from "@/hooks/useVibesApi";
import { CircularProgress } from "@mui/material";

export default async function Bemanning() {
  const consultants = await getConsultants();

  if (consultants.length == 0) {
    return <CircularProgress />;
  }

  else {
    return (
      <div>
        <h1>Konsulenter</h1>
        <FilteredConsultantsList consultants={consultants} />
      </div>
    );
  }
}

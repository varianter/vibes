import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import { getConsultants } from "@/data/getConsultants";

export default async function Bemanning() {
  const consultants = await getConsultants();

  return (
    <div>
      <h1>Konsulenter</h1>
      <FilteredConsultantsList consultants={consultants} />
    </div>
  );
}

import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Variant } from "@/types";

export default async function Bemanning() {
  const consultants =  await fetchWithToken<Variant[]>("variants") ?? [];

  return (
    <div>
      <h1>Konsulenter</h1>
      <FilteredConsultantsList consultants={consultants} />
    </div>
  );
}

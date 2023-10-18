import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Consultant } from "@/types";

export default async function Bemanning({params}: {params: {organisation: string}}) {
  const consultants = (await fetchWithToken<Consultant[]>(`${params.organisation}/consultants`)) ?? [];

  return (
    <div>
      <h1>Konsulenter</h1>
      <FilteredConsultantsList consultants={consultants} />
    </div>
  );
}

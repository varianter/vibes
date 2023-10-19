import StaffingSidebar from "@/components/StaffingSidebar";
import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Consultant } from "@/types";

export default async function Bemanning() {
  const consultants = (await fetchWithToken<Consultant[]>("consultants")) ?? [];

  return (
    <div className="flex flex-row">
      <StaffingSidebar />

      <div className="p-6 w-full">
        <h1>Konsulenter</h1>
        <FilteredConsultantsList consultants={consultants} />{" "}
      </div>
    </div>
  );
}

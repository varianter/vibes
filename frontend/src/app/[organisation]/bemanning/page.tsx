import StaffingSidebar from "@/components/StaffingSidebar";
import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Consultant, Department } from "@/types";
import { ConsultantFilterProvider } from "@/components/FilteredConsultantProvider";

export default async function Bemanning({
  params,
}: {
  params: { organisation: string };
}) {
  const consultants =
    (await fetchWithToken<Consultant[]>(
      `${params.organisation}/consultants`,
    )) ?? [];

  const departments =
    (await fetchWithToken<Department[]>(
      `organisations/${params.organisation}/departments`,
    )) ?? [];

  return (
    <ConsultantFilterProvider
      consultants={consultants}
      departments={departments}
    >
      <StaffingSidebar />

      <div className="main pl-12 p-6 w-full">
        <h1>Bemanning</h1>
        <FilteredConsultantsList />
      </div>
    </ConsultantFilterProvider>
  );
}

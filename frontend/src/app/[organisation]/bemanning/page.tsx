import StaffingSidebar from "@/components/StaffingSidebar";
import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import { fetchWithToken } from "@/data/fetchWithToken";
import { Consultant, Department } from "@/types";
import { ConsultantFilterProvider } from "@/components/FilteredConsultantProvider";
import { stringToWeek } from "@/data/urlUtils";
import InfoPillDescriptions from "@/components/InfoPillDescriptions";

export default async function Bemanning({
  params,
  searchParams,
}: {
  params: { organisation: string };
  searchParams: { selectedWeek?: string };
}) {
  const selectedWeek = stringToWeek(searchParams.selectedWeek || undefined);

  const consultants =
    (await fetchWithToken<Consultant[]>(
      `${params.organisation}/consultants${
        selectedWeek
          ? `?Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
          : ""
      }`,
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

      <div className="main pl-12 p-6 w-full flex flex-col gap-8">
        <h1>Bemanning</h1>
        <FilteredConsultantsList />
        <InfoPillDescriptions />
      </div>
    </ConsultantFilterProvider>
  );
}

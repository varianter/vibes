import StaffingSidebar from "@/components/StaffingSidebar";
import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { Consultant, Department } from "@/types";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import { parseYearWeekFromUrlString } from "@/data/urlUtils";
import InfoPillDescriptions from "@/components/InfoPillDescriptions";

export default async function Bemanning({
  params,
  searchParams,
}: {
  params: { organisation: string };
  searchParams: { selectedWeek?: string; weekSpan?: string };
}) {
  const selectedWeek = parseYearWeekFromUrlString(
    searchParams.selectedWeek || undefined,
  );
  const weekSpan = searchParams.weekSpan || undefined;

  const consultants =
    (await fetchWithToken<Consultant[]>(
      `${params.organisation}/consultants${
        selectedWeek
          ? `?Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
          : ""
      }${weekSpan ? `${selectedWeek ? "&" : "?"}WeekSpan=${weekSpan}` : ""}`,
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

      <div className="main p-4 w-full flex flex-col gap-8">
        <h1>Bemanning</h1>
        <FilteredConsultantsList />
        <InfoPillDescriptions />
      </div>
    </ConsultantFilterProvider>
  );
}

"use client";

import VacationCalendar from "@/components/VacationCalendar";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { ConsultantReadModel, VacationReadModel } from "@/api-types";
import { useQuery } from "@tanstack/react-query";
import { useOrganizationContext } from "@/context/organization";
import { useSessionContext } from "@/context/session";

export function VacationPageContent() {
  const { organization } = useOrganizationContext();
  const { session } = useSessionContext();

  const email =
    session && session.user && session.user.email ? session.user.email : "";

  const { data: publicHolidays, isFetching: publicHolidaysFetching } = useQuery(
    {
      queryKey: ["publicHolidays", organization],
      queryFn: () =>
        fetchWithToken<string[]>(`${organization}/vacations/publicHolidays`),
    },
  );

  const { data: consultant, isFetching: consultantFetching } = useQuery({
    queryKey: ["consultant", email],
    queryFn: () =>
      fetchWithToken<ConsultantReadModel>(
        `${organization}/consultants/${email}`,
      ),
  });

  const { data: vacationDays, isFetching: vacationsFetching } = useQuery({
    queryKey: ["vacationDays", consultant?.id],
    queryFn: () =>
      fetchWithToken<VacationReadModel>(
        `${organization}/vacations/${consultant?.id}/get`,
      ),
    enabled: !!consultant,
  });

  const isFetching =
    publicHolidaysFetching || consultantFetching || vacationsFetching;

  if (!isFetching && !consultant) {
    return (
      <>
        <h1>Fant ikke konsulent</h1>
        {process.env.NODE_ENV !== "production" && session?.user && (
          <p>
            Har du husket å opprette en konsulent med epost-adresse{" "}
            {session?.user?.email}?
          </p>
        )}
      </>
    );
  }

  if (!isFetching && vacationDays === undefined) {
    return <h1>Fant ikke feriemodell for konsulent</h1>;
  }

  return (
    <VacationCalendar
      consultant={consultant}
      vacationDays={vacationDays}
      publicHolidays={publicHolidays ?? []}
      organisationUrl={organization ?? ""}
      isLoading={isFetching}
    />
  );
}

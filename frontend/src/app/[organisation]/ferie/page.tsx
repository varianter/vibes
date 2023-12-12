import { ConsultantReadModel, VacationReadModel } from "@/api-types";
import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import VacationCalendar from "@/components/VacationCalendar";
import { fetchWithToken } from "@/data/apiCallsWithToken";

export default async function Ferie({
  params,
}: {
  params: { organisation: string };
}) {
  const session =
    !process.env.NEXT_PUBLIC_NO_AUTH &&
    (await getCustomServerSession(authOptions));

  const userEmail =
    session && session.user && session.user.email ? session.user.email : "";

  const consultant =
    (await fetchWithToken<ConsultantReadModel>(
      `${params.organisation}/consultants/single?Email=${userEmail}`,
    )) ?? undefined;

  const vacationDays =
    (await fetchWithToken<VacationReadModel>(
      `${params.organisation}/vacations/${consultant?.id}/get`,
    )) ?? undefined;

  const publicHolidays =
    (await fetchWithToken<string[]>(
      `${params.organisation}/vacations/publicHolidays`,
    )) ?? undefined;

  return (
    consultant &&
    vacationDays &&
    publicHolidays && (
      <VacationCalendar
        consultant={consultant}
        vacationDays={vacationDays}
        publicHolidays={publicHolidays}
        organisationUrl={params.organisation}
      />
    )
  );
}

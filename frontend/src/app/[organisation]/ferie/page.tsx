import { ConsultantReadModel, VacationReadModel } from "@/api-types";
import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import VacationCalendar from "@/components/VacationCalendar";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Ferie | VIBES",
};

export default async function Ferie({
  params,
}: {
  params: { organisation: string };
}) {
  const session =
    !process.env.NEXT_PUBLIC_NO_AUTH &&
    (await getCustomServerSession(authOptions));

  const email =
    session && session.user && session.user.email ? session.user.email : "";

  const [consultant, publicHolidays] = await Promise.all([
    fetchWithToken<ConsultantReadModel>(
      `${params.organisation}/consultants/${email}`,
    ),
    fetchWithToken<string[]>(`${params.organisation}/vacations/publicHolidays`),
  ]);

  const vacationDays =
    (await fetchWithToken<VacationReadModel>(
      `${params.organisation}/vacations/${consultant?.id}/get`,
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

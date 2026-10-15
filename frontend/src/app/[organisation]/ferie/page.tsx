import { SingleConsultantReadModel, VacationReadModel } from "@/api-types";
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
  searchParams,
}: {
  params: { organisation: string };
  searchParams: { consultantId?: string };
}) {
  const session =
    !process.env.NEXT_PUBLIC_NO_AUTH &&
    (await getCustomServerSession(authOptions));

  const email =
    session && session.user && session.user.email ? session.user.email : "";

  const [allConsultants, publicHolidays] = await Promise.all([
    fetchWithToken<SingleConsultantReadModel[]>(
      `${params.organisation}/consultants`,
    ),
    fetchWithToken<string[]>(`${params.organisation}/vacations/publicHolidays`),
  ]);

  const sortedConsultants = [...(allConsultants ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name, "nb"),
  );

  const selectedId = searchParams.consultantId
    ? parseInt(searchParams.consultantId, 10)
    : undefined;

  const consultant =
    sortedConsultants.find((c) =>
      selectedId !== undefined ? c.id === selectedId : c.email === email,
    ) ?? sortedConsultants[0];

  const vacationDays = consultant
    ? (await fetchWithToken<VacationReadModel>(
        `${params.organisation}/vacations/${consultant.id}/get`,
      )) ?? undefined
    : undefined;

  return (
    consultant &&
    vacationDays &&
    publicHolidays && (
      <VacationCalendar
        consultant={consultant}
        vacationDays={vacationDays}
        publicHolidays={publicHolidays}
        organisationUrl={params.organisation}
        allConsultants={sortedConsultants}
      />
    )
  );
}

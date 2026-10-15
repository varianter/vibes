"use client";

import { ConsultantWithForecast } from "@/api-types";
import { useModal } from "@/hooks/useModal";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ActionButton from "@/components/Buttons/ActionButton";
import EasyModal from "@/components/Modals/EasyModal";
import { Download } from "react-feather";

// Backend starter alltid på første måned i et kvartal
const QUARTERS = [
  { label: "Januar", startMonth: "01" },
  { label: "April", startMonth: "04" },
  { label: "Juli", startMonth: "07" },
  { label: "Oktober", startMonth: "10" },
];

function currentQuarterIndex() {
  return Math.floor(new Date().getMonth() / 3);
}

function generateCsv(data: ConsultantWithForecast[]): string {
  const months = data[0]?.bookings.map((b) => b.month) ?? [];

  const deptMap = new Map<
    string,
    { name: string; consultants: ConsultantWithForecast[] }
  >();

  data.forEach((c) => {
    const deptId = c.consultant.department.id;
    if (!deptMap.has(deptId)) {
      deptMap.set(deptId, {
        name: c.consultant.department.name,
        consultants: [],
      });
    }
    deptMap.get(deptId)!.consultants.push(c);
  });

  const rows: string[][] = [
    ["Ordre (t)", ...months.map((month) => month.slice(0, 7))],
  ];

  deptMap.forEach(({ name, consultants }) => {
    const ordrePerMonth = months.map((month) =>
      consultants.reduce((sum, c) => {
        const booking = c.bookings.find((b) => b.month === month);
        return sum + (booking?.bookingModel.totalBillable ?? 0);
      }, 0),
    );
    rows.push([
      name,
      ...ordrePerMonth.map((ordre) => ordre.toFixed(1).replace(".", ",")),
    ]);
  });

  return rows.map((r) => r.join(";")).join("\n");
}

function downloadCsv(csv: string, filename: string) {
  const bom = "﻿";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ForecastDepartmentReportModal() {
  const { modalRef, openModal, closeModal } = useModal({
    closeOnBackdropClick: true,
  });
  const pathname = usePathname();
  const organisationUrl = pathname.split("/")[1];

  const [year, setYear] = useState(new Date().getFullYear());
  const [quarterIndex, setQuarterIndex] = useState(currentQuarterIndex());
  const [monthCount, setMonthCount] = useState(12);
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!year || !(monthCount > 0)) return;
    setLoading(true);
    try {
      const startDate = `${year}-${QUARTERS[quarterIndex].startMonth}-01`;
      const res = await fetch(
        `/${organisationUrl}/rapport/api/forecast?startDate=${startDate}&monthCount=${monthCount}`,
      );
      const data: ConsultantWithForecast[] = await res.json();
      const csv = generateCsv(data);
      downloadCsv(
        csv,
        `ordre-per-avdeling-${year}-${QUARTERS[quarterIndex].startMonth}-${monthCount}mnd.csv`,
      );
      closeModal();
    } catch (e) {
      console.error("Failed to generate report", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ActionButton
        variant="secondary"
        iconLeft={<Download size={16} />}
        onClick={openModal}
        small
      >
        Last ned
      </ActionButton>

      <EasyModal
        modalRef={modalRef}
        title="Ordre per avdeling"
        showCloseButton
        onClose={closeModal}
        width="360px"
      >
        <div className="flex flex-col gap-4 pt-2">
          <p className="small text-black/60">
            CSV-eksport av ordretimer summert per avdeling og måned.
          </p>

          <div className="flex flex-col gap-1">
            <label className="xsmall text-black/60 uppercase tracking-wide">
              År
            </label>
            <input
              type="number"
              value={Number.isNaN(year) ? "" : year}
              min={2020}
              max={2040}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="border border-primary/30 rounded-lg px-3 py-2 small focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="xsmall text-black/60 uppercase tracking-wide">
              Startmåned
            </label>
            <select
              value={quarterIndex}
              onChange={(e) => setQuarterIndex(parseInt(e.target.value, 10))}
              className="border border-primary/30 rounded-lg px-3 py-2 small bg-white focus:outline-none focus:border-primary"
            >
              {QUARTERS.map((q, i) => (
                <option key={i} value={i}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="xsmall text-black/60 uppercase tracking-wide">
              Antall måneder
            </label>
            <input
              type="number"
              value={Number.isNaN(monthCount) ? "" : monthCount}
              min={1}
              max={36}
              onChange={(e) => setMonthCount(parseInt(e.target.value, 10))}
              className="border border-primary/30 rounded-lg px-3 py-2 small focus:outline-none focus:border-primary"
            />
          </div>

          <ActionButton
            variant="primary"
            fullWidth
            onClick={handleDownload}
            disabled={loading || !year || !(monthCount > 0)}
          >
            {loading ? "Laster..." : "Last ned CSV"}
          </ActionButton>
        </div>
      </EasyModal>
    </>
  );
}

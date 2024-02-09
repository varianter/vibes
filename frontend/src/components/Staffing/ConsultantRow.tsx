"use client";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import React, { useContext, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { DetailedBookingRows } from "@/components/Staffing/DetailedBookingRows";
import { WeekCell } from "@/components/Staffing/WeekCell";
import { AddStaffingCell } from "@/components/Staffing/AddStaffingCell";
import { useModal } from "@/hooks/useModal";
import { EditEngagementHourModal } from "./EditEngagementHourModal/EditEngagementHoursModal";
import { usePathname } from "next/navigation";

export default function ConsultantRows({
  consultant,
}: {
  consultant: ConsultantReadModel;
}) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [hoveredRowWeek, setHoveredRowWeek] = useState(-1);

  const columnCount = consultant.bookings.length ?? 0;

  function toggleListElementVisibility() {
    setIsListElementVisible((old) => !old);
  }

  const {
    closeModal: closeChangeEngagementModal,
    openModal: openChangeEngagementModal,
    modalRef: changeEngagementModalRef,
  } = useModal({
    closeOnBackdropClick: false,
  });

  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(undefined);
  const [selectedProject, setSelectedProject] = useState<
    ProjectWithCustomerModel | undefined
  >(undefined);

  const organisationUrl = usePathname().split("/")[1];

  useEffect(() => {
    async function fetchProject() {
      const url = `/${organisationUrl}/bemanning/api/projects?projectId=${selectedProjectId}`;

      try {
        const data = await fetch(url, {
          method: "get",
        });
        setSelectedProject((await data.json()) as ProjectWithCustomerModel);
      } catch (e) {
        console.error("Error updating staffing", e);
      }
    }
    selectedProjectId && fetchProject();
  }, [organisationUrl, selectedProjectId]);

  function openEngagementAndSetID(id: number) {
    setSelectedProjectId(id);
    openChangeEngagementModal();
  }

  function onCloseEngagementModal() {
    setSelectedProject(undefined);
    setSelectedProjectId(undefined);
  }

  return (
    <>
      <tr
        className="h-[52px]"
        onMouseEnter={() => setIsRowHovered(true)}
        onMouseLeave={() => setIsRowHovered(false)}
      >
        <td
          className={`border-l-2 ${
            isListElementVisible
              ? "border-l-secondary"
              : isRowHovered
              ? "border-l-primary"
              : "border-l-primary/5"
          } `}
        >
          <button
            className={`p-2 rounded-lg ml-2 hover:bg-primary hover:bg-opacity-10 ${
              isListElementVisible && "rotate-180"
            }`}
            onClick={toggleListElementVisibility}
          >
            <ChevronDown className={`text-primary w-6 h-6`} />
          </button>
        </td>
        <td>
          <div className="flex flex-col gap-1 ">
            <p
              className={`text-black text-start ${
                isListElementVisible ? "normal-medium" : "normal"
              }`}
            >
              {consultant.name}
            </p>
            <p className="xsmall text-black/75 text-start">
              {`${consultant.yearsOfExperience} års erfaring`}
            </p>
          </div>
          {isListElementVisible && (
            <EditEngagementHourModal
              modalRef={changeEngagementModalRef}
              project={selectedProject}
              onClose={onCloseEngagementModal}
            />
          )}
        </td>
        {consultant.bookings.map((b, index) => (
          <WeekCell
            key={index}
            bookedHoursPerWeek={b}
            isListElementVisible={isListElementVisible}
            setIsListElementVisible={setIsListElementVisible}
            consultant={consultant}
            setHoveredRowWeek={setHoveredRowWeek}
            hoveredRowWeek={hoveredRowWeek}
            columnCount={columnCount}
            isLastCol={index == consultant.bookings.length - 1}
            isSecondLastCol={index == consultant.bookings.length - 2}
          />
        ))}
      </tr>
      {isListElementVisible &&
        consultant.detailedBooking &&
        consultant.detailedBooking.map((db, index) => (
          <DetailedBookingRows
            key={index}
            consultant={consultant}
            detailedBooking={db}
            openEngagementAndSetID={openEngagementAndSetID}
          />
        ))}
      {isListElementVisible && (
        <tr>
          <AddStaffingCell consultant={consultant} />
        </tr>
      )}
    </>
  );
}

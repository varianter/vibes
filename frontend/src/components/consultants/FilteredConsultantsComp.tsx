"use client";
import {
  Competence,
  ConsultantReadModel,
  Degree,
  DepartmentReadModel,
} from "@/api-types";
import { useSimpleConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Edit3, Check } from "react-feather";
import EditableTableTextCell from "./EditableTableTextCell";
import EditableTableDateCell from "./EditableTableDateCell";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import EditableTableSelectDepartmentCell from "./EditableTableSelectDepartmentCell";
import { useParams } from "next/navigation";
import EditableTableCompetencesCell from "./EditableTableCompetencesCell";
import EditableTableDegreeCell from "./EditableTableDegreeCell";
import EditableTableSelectGradYearCell from "./EditableTableSelectGradYearEdit";
import { isEqual } from "lodash";

export default function FilteredConsultantsComp() {
  const { filteredConsultants, setConsultants } = useSimpleConsultantsFilter();
  const [editableConsultants, setEditableConsultants] = useState<
    ConsultantReadModel[]
  >([]);
  const { organisation } = useParams();

  const [selectedEditConsultant, setSelectedEditConsultant] =
    useState<ConsultantReadModel | null>(null);

  const listRef = useRef<HTMLTableSectionElement>(null);
  const { setIsDisabledHotkeys } = useContext(FilteredContext);
  const { competences, departments } = useContext(FilteredContext);
  const currentConsultantEditRef = useRef(selectedEditConsultant);

  useEffect(() => {
    if (
      filteredConsultants &&
      !isEqual(editableConsultants, filteredConsultants)
    ) {
      setEditableConsultants(filteredConsultants);
    }
  }, [filteredConsultants]);

  async function saveConsultant(consultant: ConsultantReadModel | null) {
    if (consultant) {
      const updatedConsultant = await fetch(
        `/${organisation}/konsulenter/api/consultant`,
        {
          method: "PUT",
          body: JSON.stringify(consultant),
        },
      );
      const res = await updatedConsultant.json();
      setConsultants((prevConsultants) =>
        prevConsultants.map((c) => {
          if (c.id === res.id) {
            return { ...c, ...res };
          }
          return c;
        }),
      );
    }
  }

  useEffect(() => {
    currentConsultantEditRef.current = selectedEditConsultant;
  }, [selectedEditConsultant]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        saveConsultant(currentConsultantEditRef.current ?? null);
        setSelectedEditConsultant(null);
        setIsDisabledHotkeys(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [listRef]);

  return (
    <table className={`border-separate border-spacing-y-1 table-fixed`}>
      <thead>
        <tr className="sticky -top-6 bg-white z-10">
          <th className="px-2 py-1 pt-3 bg-white w-1/6">
            <div className="flex flex-row gap-1 items-center">
              <p className="normal-medium ">Konsulenter</p>
              <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                {editableConsultants.filter((e) => !e.endDate)?.length}
              </p>
            </div>
          </th>

          <th className="py-1 pt-3 w-44">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Mail</p>
            </div>
          </th>

          <th className="py-1 pt-3 w-36">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Startdato</p>
            </div>
          </th>

          <th className="py-1 pt-3 w-36">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Sluttdato</p>
            </div>
          </th>

          <th className="py-1 pt-3 w-44">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Avdeling</p>
            </div>
          </th>

          <th className="min-w-[120px] md:min-w-[200px] py-1 pt-3">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Kompetanse</p>
            </div>
          </th>

          <th className="py-1 pt-3 w-44">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Grad</p>
            </div>
          </th>

          <th className="py-1 pt-3 w-32">
            <div className="flex flex-col gap-1">
              <p className="normal text-left">Eksamensår</p>
            </div>
          </th>
          <th className="py-1 pt-3 w-14">
            <div className="flex flex-col gap-1"></div>
          </th>
        </tr>
      </thead>

      <tbody ref={listRef}>
        {editableConsultants
          .filter(
            (e) =>
              !e.endDate ||
              new Date(e.endDate).setHours(0, 0, 0, 0) >=
                new Date().setHours(0, 0, 0, 0),
          )
          .map((consultant) => (
            <tr
              key={consultant.id}
              className="h-[52px] bg-background_light_purple hover:bg-background_light_purple_hover transition-all cursor-pointer rounded-md"
              onDoubleClick={() => {
                setSelectedEditConsultant(consultant);
                setIsDisabledHotkeys(true);
              }}
              onClick={() => {
                if (
                  selectedEditConsultant &&
                  selectedEditConsultant.id !== consultant.id
                ) {
                  saveConsultant(currentConsultantEditRef.current ?? null);
                  setSelectedEditConsultant(null);
                  setIsDisabledHotkeys(false);
                }
              }}
            >
              <td className="px-2 py-1 rounded-l-md">
                <div className="flex flex-row align-center self-center gap-2">
                  {consultant.imageUrl ? (
                    <Image
                      src={consultant.imageUrl}
                      alt={consultant.name}
                      className="w-8 h-8 rounded-full self-center object-contain"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary"></div>
                  )}

                  <div className="flex flex-col justify-center">
                    {/* Not created own because its not using <td> as wrapper */}
                    <div className="pr-3">
                      {selectedEditConsultant?.id === consultant.id ? (
                        <input
                          className="w-full py-2 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                          type="text"
                          value={selectedEditConsultant.name}
                          onChange={(e) =>
                            setSelectedEditConsultant((selectedConsultant) => {
                              if (!selectedConsultant) return null;
                              return {
                                ...selectedConsultant,
                                name: e.target.value,
                              };
                            })
                          }
                        />
                      ) : (
                        <p className={"normal text-primary"}>
                          {consultant.name}
                        </p>
                      )}
                    </div>
                    {selectedEditConsultant?.id !== consultant.id ? (
                      <p className="text-xs text-text_light_black">
                        Erfaring {consultant.yearsOfExperience} år
                      </p>
                    ) : null}
                  </div>
                </div>
              </td>
              <EditableTableTextCell
                setConsultant={(email: string) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, email };
                  })
                }
                text={consultant.email}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableDateCell
                setConsultant={(date: Date | undefined) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, startDate: date };
                  })
                }
                date={consultant.startDate}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableDateCell
                setConsultant={(date: Date | undefined) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, endDate: date };
                  })
                }
                date={consultant.endDate}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableSelectDepartmentCell
                options={departments}
                setConsultant={(department: DepartmentReadModel) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, department };
                  })
                }
                department={consultant.department}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableCompetencesCell
                options={competences}
                setConsultant={(competences: Competence[]) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, competences };
                  })
                }
                competences={consultant.competences}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableDegreeCell
                setConsultant={(degree: Degree) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, degree };
                  })
                }
                degree={consultant.degree}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableSelectGradYearCell
                setConsultant={(year: number) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, graduationYear: year };
                  })
                }
                gradYear={consultant.graduationYear}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />

              <td className="rounded-r-md">
                <button
                  className="flex self-center hover:bg-background_light_purple p-2 rounded float-right"
                  onClick={() => {
                    if (
                      selectedEditConsultant &&
                      selectedEditConsultant.id === consultant.id
                    ) {
                      saveConsultant(currentConsultantEditRef.current ?? null);
                      setSelectedEditConsultant(null);
                      setIsDisabledHotkeys(false);
                    } else if (selectedEditConsultant === null) {
                      setSelectedEditConsultant(consultant);
                      setIsDisabledHotkeys(true);
                    }
                  }}
                >
                  {selectedEditConsultant?.id === consultant.id ? (
                    <Check className="text-primary" size="24" />
                  ) : (
                    <Edit3 className="text-primary" size="24" />
                  )}
                </button>
              </td>
            </tr>
          ))}

        {/* Inactive consultants */}

        <tr>
          <td className="py-4 font-bold text-">
            <div className="flex flex-row gap-1 items-center">
              <p className="normal-medium ">Inaktive konsulenter</p>
              <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                {editableConsultants.filter((e) => e.endDate)?.length}
              </p>
            </div>
          </td>
        </tr>

        {editableConsultants
          .filter(
            (e) =>
              e.endDate &&
              new Date(e.endDate).setHours(0, 0, 0, 0) <
                new Date().setHours(0, 0, 0, 0),
          )
          .map((consultant) => (
            <tr
              key={consultant.id}
              className="h-[52px] bg-background_light_purple hover:bg-background_light_purple_hover transition-all cursor-pointer rounded-md"
              onDoubleClick={() => {
                setSelectedEditConsultant(consultant);
                setIsDisabledHotkeys(true);
              }}
              onClick={() => {
                if (
                  selectedEditConsultant &&
                  selectedEditConsultant.id !== consultant.id
                ) {
                  saveConsultant(currentConsultantEditRef.current ?? null);
                  setSelectedEditConsultant(null);
                  setIsDisabledHotkeys(false);
                }
              }}
            >
              <td className="px-2 py-1 rounded-l-md">
                <div className="flex flex-row align-center self-center gap-2">
                  {consultant.imageUrl ? (
                    <Image
                      src={consultant.imageUrl}
                      alt={consultant.name}
                      className="w-8 h-8 rounded-full self-center object-contain"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary"></div>
                  )}

                  <div className="flex flex-col justify-center">
                    <div className="pr-3">
                      {selectedEditConsultant?.id === consultant.id ? (
                        <input
                          className="w-full py-2 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                          type="text"
                          value={selectedEditConsultant.name}
                          onChange={(e) =>
                            setSelectedEditConsultant((selectedConsultant) => {
                              if (!selectedConsultant) return null;
                              return {
                                ...selectedConsultant,
                                name: e.target.value,
                              };
                            })
                          }
                        />
                      ) : (
                        <p className={"normal text-primary"}>
                          {consultant.name}
                        </p>
                      )}
                    </div>
                    {selectedEditConsultant?.id === consultant.id ? null : (
                      <p className="text-xs text-text_light_black">
                        Erfaring {consultant.yearsOfExperience} år
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <EditableTableTextCell
                setConsultant={(email: string) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, email };
                  })
                }
                text={consultant.email}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableDateCell
                setConsultant={(date: Date | undefined) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, startDate: date };
                  })
                }
                date={consultant.startDate}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableDateCell
                setConsultant={(date: Date | undefined) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, endDate: date };
                  })
                }
                date={consultant.endDate}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableSelectDepartmentCell
                options={departments}
                setConsultant={(department: DepartmentReadModel) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, department };
                  })
                }
                department={consultant.department}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableCompetencesCell
                options={competences}
                setConsultant={(competences: Competence[]) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, competences };
                  })
                }
                competences={consultant.competences}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableDegreeCell
                setConsultant={(degree: Degree) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, degree };
                  })
                }
                degree={consultant.degree}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />
              <EditableTableSelectGradYearCell
                setConsultant={(year: number) =>
                  setSelectedEditConsultant((selectedConsultant) => {
                    if (!selectedConsultant) return null;
                    return { ...selectedConsultant, graduationYear: year };
                  })
                }
                gradYear={consultant.graduationYear}
                isEditing={selectedEditConsultant?.id === consultant.id}
              />

              <td className="px-2 py-1 rounded-r-md float-right">
                <button
                  className="flex self-center hover:bg-background_light_purple p-2 rounded"
                  onClick={() => {
                    if (
                      selectedEditConsultant &&
                      selectedEditConsultant.id === consultant.id
                    ) {
                      saveConsultant(currentConsultantEditRef.current ?? null);
                      setSelectedEditConsultant(null);
                      setIsDisabledHotkeys(false);
                    } else if (selectedEditConsultant === null) {
                      setSelectedEditConsultant(consultant);
                      setIsDisabledHotkeys(true);
                    }
                  }}
                >
                  {selectedEditConsultant?.id === consultant.id ? (
                    <Check className="text-primary" size="24" />
                  ) : (
                    <Edit3 className="text-primary" size="24" />
                  )}
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

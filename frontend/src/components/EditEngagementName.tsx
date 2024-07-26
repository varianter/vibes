"use client";
import { UpdateEngagementNameWriteModel } from "@/api-types";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Edit3 } from "react-feather";

export default function EditEngagementName({
  engagementName,
  engagementId,
  organisationName,
}: {
  engagementName: string;
  engagementId: number;
  organisationName: string;
}) {
  const [newEngagementName, setNewEngagementName] = useState(engagementName);
  const [inputFieldIsActive, setInputFieldIsActive] = useState(false);
  const [lastUpdatedName, setLastUpdatedName] = useState(engagementName);

  const router = useRouter();

  async function handleChange(newName: string) {
    if (!newName) {
      return;
    }

    if (newName === lastUpdatedName) {
      return;
    }
    setNewEngagementName(newName);

    const body: UpdateEngagementNameWriteModel = {
      engagementName: newName,
      engagementId: engagementId,
    };

    const res = await submitAddEngagementForm(body);
    setInputFieldIsActive(false);
    setLastUpdatedName(newName);
  }

  async function submitAddEngagementForm(body: UpdateEngagementNameWriteModel) {
    const url = `/${organisationName}/bemanning/api/projects/updateProjectName`;
    try {
      const data = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          ...body,
        }),
      });
      return data;
    } catch (e) {
      console.error("Error updating engagement name", e);
    }
  }

  return (
    <>
      {" "}
      {inputFieldIsActive ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChange(newEngagementName);
          }}
          className="flex flex-row gap-2 items-center"
        >
          <input
            value={newEngagementName}
            onChange={(e) => setNewEngagementName(e.target.value)}
            className="h1 w-full"
            autoFocus
            onBlur={() => {
              setInputFieldIsActive(false);
              handleChange(newEngagementName);
            }}
          />
        </form>
      ) : (
        <div
          className="flex flex-row gap-2 items-center"
          onClick={() => setInputFieldIsActive(true)}
        >
          <h1 className="w-fit peer">{newEngagementName} </h1>
          <Edit3
            className={`text-primary/50 h-6 w-6 m-2 hidden peer-hover:flex`}
          />
        </div>
      )}
    </>
  );
}

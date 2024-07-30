"use client";
import { UpdateEngagementNameWriteModel } from "@/api-types";
import { useState } from "react";
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
  const [inputIsInvalid, setInputIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleChange(newName: string) {
    if (newName === lastUpdatedName) {
      setInputFieldIsActive(false);
      return;
    }
    setNewEngagementName(newName);

    const body: UpdateEngagementNameWriteModel = {
      engagementName: newName,
      engagementId: engagementId,
    };

    const res = await submitAddEngagementForm(body);
    const data = await res.json();

    if (res.ok) {
      setInputFieldIsActive(false);
      setLastUpdatedName(newName);
      setInputIsInvalid(false);
    } else {
      setInputIsInvalid(true);
      setInputFieldIsActive(true);
      if (data.code === "1872") {
        setErrorMessage("Prosjektnavnet eksisterer hos kunden fra før");
      } else if (data.code === "1") {
        setErrorMessage("Prosjektnavn kan ikke være tomt");
      } else {
        setErrorMessage("Noe gikk galt, spør på slack");
      }
    }
  }

  async function submitAddEngagementForm(body: UpdateEngagementNameWriteModel) {
    const url = `/${organisationName}/bemanning/api/projects/updateProjectName`;
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        ...body,
      }),
    });
    return res;
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
          className="flex flex-col gap-2 "
        >
          <input
            value={newEngagementName}
            onChange={(e) => {
              setNewEngagementName(e.target.value);
              setInputIsInvalid(false);
            }}
            className={`h1 w-full px-2 ${
              inputIsInvalid ? " text-error focus:outline-error" : ""
            }`}
            autoFocus
            onBlur={() => {
              setInputFieldIsActive(false);
              handleChange(newEngagementName);
            }}
          />
          {inputIsInvalid && (
            <p className="small text-error/80 mb-2 italic">{errorMessage}</p>
          )}
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

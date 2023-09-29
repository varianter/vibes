"use client";
import {
  CircularProgress,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import useVibesApi from "./hooks/useVibesApi";
import React, { useState } from "react";

export function VariantList() {
  const [includeOccupied, setIncludeOccupied] = useState<boolean>(false);
  const { data, isLoading, isError, error } = useVibesApi(includeOccupied);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (data) {
    return (
      <div>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={includeOccupied}
                onChange={() => setIncludeOccupied((old) => !old)}
              />
            }
            label={"Include occupied consultants"}
          />
        </FormGroup>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Competences</th>
              {data[0].bookings.map((weeklyBooking) => (
                <th key={weeklyBooking.weekNumber}>
                  W# {weeklyBooking.weekNumber}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((variant) => (
              <tr key={variant.id + "tr"}>
                <td>{variant.name}</td>
                <td>{variant.email}</td>
                <td>{variant.department}</td>
                <td>{variant.competences.join(", ")}</td>
                {variant.bookings.map((a) => (
                  <td key={`${variant.id}/${a.weekNumber}`}>
                    {a.bookedHours}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

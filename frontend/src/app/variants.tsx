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
  // Add a switch for this later
  const { data, isLoading, isError, error } = useVibesApi(true);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (data) {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Competences</th>
            </tr>
          </thead>
          <tbody>
            {data.map((variant) => (
              <tr key={variant.id + "tr"}>
                <td>{variant.name}</td>
                <td>{variant.email}</td>
                <td>{variant.department}</td>
                <td>{variant.competences.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

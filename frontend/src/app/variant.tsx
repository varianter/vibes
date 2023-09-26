"use client"
import { CircularProgress } from "@mui/material";
import useVibesApi from "./hooks/useVibesApi";

export function VariantList() {

  const { data, isLoading, isError, error } = useVibesApi();

  if (isLoading) {
    return <CircularProgress />
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
              {data[0].availability.map((availabilityWeek) => (
                <th key={availabilityWeek.weekNumber}>W# {availabilityWeek.weekNumber}</th>
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
                {variant.availability.map((a) => (
                  <td key={`${variant.id}/${a.weekNumber}`}>{a.availableHours}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

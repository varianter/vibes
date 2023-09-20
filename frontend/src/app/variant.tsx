"use client";

import { useState, useEffect } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { fetchWithToken } from "@/utils/ApiUtils";
import { Variant } from "@/types";

export function VariantList() {
  const [data, setData] = useState<Variant[]>([]);
  const [isLoading, setLoading] = useState(true);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWithToken("/api/variant?weeks=8").then((data) => {
        setData(data);
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Competences</th>
          {data[0].availability.map((availabilityWeek) => (
            <th key={0}>W# {availabilityWeek.weekNumber}</th>
          ))}
        </tr>
        {data.map((variant) => (
          <tr key={variant.id}>
            <td>{variant.name}</td>
            <td>{variant.email}</td>
            <td>{variant.department}</td>
            <td>{variant.competences.join(", ")}</td>
            {variant.availability.map((a) => (
              <td key={`${variant.id}/${a.weekNumber}`}>{a.availableHours}</td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

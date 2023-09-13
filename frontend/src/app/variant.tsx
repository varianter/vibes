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
      fetchWithToken("/api/variant").then((data) => {
        setData(data);
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <ul>
        {data.map((variant) => <li key={variant.id}>{variant.name}</li>)}
      </ul>
    </div>
  );
}

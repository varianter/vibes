"use client";
import { fetchWithToken } from "@/utils/ApiUtils";
import { useIsAuthenticated } from "@azure/msal-react";
import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";

interface Department {
  id: string;
  name: string;
}

function useDepartmentsApi() {
  const isAuthenticated = useIsAuthenticated();
  const client = useQueryClient();

  useEffect(() => client.clear(), [client]); //TODO: We need a better way of handling state/cache. This works for now though, but it's a bit hacky ngl

  return useQuery({
    queryKey: "departments",
    queryFn: async () => {
      if (isAuthenticated) {
        try {
          const response: Department[] =
            await fetchWithToken(`/api/departments`);
          return response;
        } catch (err) {
          console.error(err);
          return [];
        }
      }
      // If not authenticated, return an empty array
      return [];
    },
    refetchOnWindowFocus: false,
  });
}

export default useDepartmentsApi;

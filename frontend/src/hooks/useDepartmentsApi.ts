"use client";
import { fetchWithToken } from "@/utils/ApiUtils";
import { useIsAuthenticated } from "@azure/msal-react";
import { useQuery } from "react-query";
import { Department } from "@/types";

function useDepartmentsApi() {
  const isAuthenticated = useIsAuthenticated();

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

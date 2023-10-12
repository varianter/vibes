"use client";
import { Variant } from "@/types";
import { fetchWithToken } from "@/utils/ApiUtils";
import { useIsAuthenticated } from "@azure/msal-react";
import { useQuery } from "react-query";

function useVibesApi(includeOccupied: boolean) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: "vibes",
    queryFn: async () => {
      if (isAuthenticated) {
        try {
          const response: Variant[] = await fetchWithToken(
            `/api/v0/variants?weeks=8&includeOccupied=${includeOccupied}`,
          );
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

export default useVibesApi;

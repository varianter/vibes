"use client"
import { Variant } from '@/types';
import { fetchWithToken } from '@/utils/ApiUtils';
import { useIsAuthenticated } from '@azure/msal-react';
import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";

function useVibesApi(includeOccupied: boolean) {
  const isAuthenticated = useIsAuthenticated();
  const client = useQueryClient();

  //TODO: We need a better way of handling state/cache. This works for now though, but it's a bit hacky ngl
  useEffect(()=> client.clear(), [includeOccupied, client])

  return useQuery({queryKey: 'vibes', queryFn: async () => {
    if (isAuthenticated) {
      try {
        const response: Variant[] = await fetchWithToken(`/api/v1/variants?weeks=8&includeOccupied=${includeOccupied}`);
        return response;
        
      } catch (err) {
        console.error(err)
        return []
      }
    }
    // If not authenticated, return an empty array
    return [];
  }, refetchOnWindowFocus: false
})}

export default useVibesApi;

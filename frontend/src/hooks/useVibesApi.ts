"use client"
import { Variant } from '@/types';
import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";
import { useAuth } from './useAuth';
import { useVibesSession } from './useVibesSession';

function useVibesApi(includeOccupied: boolean) {
  const client = useQueryClient();

  //TODO: We need a better way of handling state/cache. This works for now though, but it's a bit hacky ngl
  useEffect(()=> client.clear(), [includeOccupied, client])

  const { isAuthenticated } = useAuth();
  const { azureToken } = useVibesSession();

  return useQuery({queryKey: 'vibes', queryFn: async () => {
    if (isAuthenticated && azureToken) {
      try {

        const headers = new Headers();
        const bearer = `Bearer ${azureToken}`;
      
        headers.append("Authorization", bearer);
      
        const options = {
          method: "GET",
          headers: headers,
        };

        const response = (await fetch(`/api/v0/variants?weeks=8&includeOccupied=${includeOccupied}`, options));
        const data: Variant[] = await response.json();
        return data;
        
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

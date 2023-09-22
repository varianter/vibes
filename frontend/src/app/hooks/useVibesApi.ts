import { Variant } from '@/types';
import { fetchWithToken } from '@/utils/ApiUtils';
import { useIsAuthenticated } from '@azure/msal-react';
import { useQuery } from 'react-query';

function useVibesApi() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery('vibes', async () => {
    if (isAuthenticated) {
      try {
        const response: Variant[] = await fetchWithToken('/api/variant?weeks=8');
        return response;
        
      } catch (err) {
        console.error(err)
        return []
      }
    }
    // If not authenticated, return an empty array
    return [];
  });
}

export default useVibesApi;

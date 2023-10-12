
import { Department } from "@/types";

function useDepartmentsApi() {
  // const isAuthenticated =
  //   useIsAuthenticated() || process.env.NEXT_PUBLIC_NO_AUTH;
  //
  // return useQuery({
  //   queryKey: "departments",
  //   queryFn: async () => {
  //     if (isAuthenticated) {
  //       try {
  //         const response: Department[] =
  //           await fetchWithToken(`/api/departments`);
  //         return response;
  //       } catch (err) {
  //         console.error(err);
  //         return [];
  //       }
  //     }
  //     // If not authenticated, return an empty array
  //     return [];
  //   },
  //   refetchOnWindowFocus: false,
  // });
  return { data: [], isLoading: false }
}

export default useDepartmentsApi;

import { getCameras } from "../actions/cameras";
import { useQuery } from "@tanstack/react-query";

export function useGetCameras() {
  return useQuery({
    queryFn: async () => {
      try {
        const data = await getCameras();
        if (data?.success) return data.success;
        // return data?.error;
        return [];
      } catch (error) {
        // return { error: "Server Error" };
        return [];
      }
    },
    queryKey: ["cameras"],
  });
}

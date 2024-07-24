import { getVenues } from "../actions/venues";
import { useQuery } from "@tanstack/react-query";

export function useGetVenues() {
  return useQuery({
    queryFn: async () => {
      try {
        const data = await getVenues();
        if (data?.success) return data.success;
        return [];
      } catch (error) {
        // return { error: "Server Error" };
        return [];
      }
    },
    queryKey: ["venues"],
  });
}

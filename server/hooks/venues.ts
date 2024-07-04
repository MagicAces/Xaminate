import { getVenues } from "../actions/venues";
import { useQuery } from "@tanstack/react-query";

export function useGetVenues() {
  return useQuery({
    queryFn: async () => {
      const data = await getVenues();
      if(data.success) return data.success;
      return data.error;
    },
    queryKey: ["venues"],
  });
}

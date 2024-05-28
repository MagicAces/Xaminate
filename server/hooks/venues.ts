import { getVenues } from "../actions/venues";
import { useQuery } from "@tanstack/react-query";

export function useGetVenues() {
  return useQuery({
    queryFn: async () => {
      const data = await getVenues();
      return data.success;
    },
    queryKey: ["venues"],
  });
}

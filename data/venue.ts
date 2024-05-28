import { Venue, VenueOption } from "@/types";

export const venueOptions = (venues: Venue[]): readonly VenueOption[] => {
  return venues.map((venue) => ({
    value: venue?.id,
    label: venue?.name,
    id: venue?.id,
  }));
};

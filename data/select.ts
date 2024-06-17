import { Venue, SelectOption } from "@/types";

export const venueOptions = (venues: Venue[]): readonly SelectOption[] => {
  return venues.map((venue) => ({
    value: venue?.id,
    label: venue?.name,
    isDisabled: venue?.occupied
  }));
};

export const statusOptions = (): readonly SelectOption[] => {
  return [
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "active",
      label: "Active",
    },
    {
      value: "closed",
      label: "Closed",
    },
  ];
};

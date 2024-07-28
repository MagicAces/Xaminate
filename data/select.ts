import { Venue, SelectOption } from "@/types";
import { isVenueAvailable } from "@/lib/sessions";

export const venueOptions = async (
  venues: Venue[],
  sessionStart: Date | string | null,
  sessionEnd: Date | string | null
): Promise<SelectOption[]> => {
  if (!sessionStart || !sessionEnd) {
    return venues?.map((venue) => ({
      value: venue.id,
      label: venue.name,
      isDisabled: false,
      isDeleted: venue.deleted,
    }));
  }

  const start = new Date(sessionStart);
  const end = new Date(sessionEnd);

  const options = await Promise.all(
    venues.map(async (venue) => {
      const isDisabled = !(await isVenueAvailable(
        venue.id,
        start,
        end,
        venue.bookings,
        undefined
      ));
      return {
        value: venue.id,
        label: venue.name,
        isDisabled,
        isDeleted: venue.deleted,
      };
    })
  );

  return options;
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

export const limitOptions = (): readonly SelectOption[] => {
  return [
    {
      value: 7,
      label: "7 per page",
    },
    {
      value: 10,
      label: "10 per page",
    },
    {
      value: 15,
      label: "15 per page",
    },
    {
      value: 20,
      label: "20 per page",
    },
    {
      value: 50,
      label: "50 per page",
    },
  ];
};

export const cameraVenues = (venues: Venue[]): readonly SelectOption[] => {
  const options = venues
    .filter((venue) => !venue.deleted)
    .map((venue) => {
      return {
        value: venue.id,
        label: venue.name,
        isDisabled: false,
        isDeleted: venue.deleted,
      };
    });

  return options;
};

export const cameraOptions = (): readonly SelectOption[] => {
  return [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Inactive",
      label: "Inactive",
    },
    {
      value: "Maintenance",
      label: "Maintenance",
    },
  ];
};

export const sessionBackOptions = (): readonly SelectOption[] => {
  return [
    {
      value: 7,
      label: "7",
    },
    {
      value: 10,
      label: "10",
    },
    {
      value: 12,
      label: "12",
    },
    {
      value: 15,
      label: "15",
    },
  ];
};

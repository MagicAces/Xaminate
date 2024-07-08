"use server";
import prisma from "@/prisma/prisma";

export const getVenues = async () => {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        bookings: true,
      },
    });

    const formattedVenues = venues.map((venue) => {
      const { created_on, updated_at, bookings,...rest } = venue;

      const newBookings = bookings.map((booking) => ({
        ...booking,
        start_time: booking.start_time?.toISOString(),
        end_time: booking.end_time?.toISOString(),
      }));

      return {
        ...rest,
        created_on: created_on?.toISOString(),
        updated_at: updated_at?.toISOString(),
        bookings: newBookings
      };
    });
    return { success: formattedVenues };
  } catch (error) {
    return { error: "Error fetching venues" };
    throw error;
  }
};

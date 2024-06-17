"use server";
import prisma from "@/prisma/prisma";

export const getVenues = async () => {
  try {
    const venues = await prisma.venue.findMany();

    const formattedVenues = venues.map((venue) => {
      const { occupied_from, created_on, updated_at, occupied_to, ...rest } =
        venue;

      return {
        ...rest,
        occupied_to: occupied_to ? occupied_to.toISOString() : null,
        occupied_from: occupied_from ? occupied_from.toISOString() : null,
        created_on: created_on.toISOString(),
        updated_at: updated_at.toISOString(),
      };
    });
    return { success: formattedVenues };
  } catch (error) {
    return { error: "Error fetching venues" };
    throw error;
  }
};

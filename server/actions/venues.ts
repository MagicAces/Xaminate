"use server";
import prisma from "@/prisma/prisma";

export const getVenues = async () => {
  try {
    const venues = await prisma.venue.findMany();

    return { success: venues };
  } catch (error) {
    return { error: "Problem"}
    throw error;
  }
};

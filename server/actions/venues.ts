"use server";
import prisma from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { authAction } from "./actions";
import { editVenueSchema } from "@/lib/schema";
import { Prisma } from "@prisma/client";
import { EditVenuesPayload } from "@/types";

export const getVenues = async () => {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        bookings: true,
      },
    });

    const formattedVenues = venues.map((venue) => {
      const { created_on, updated_at, bookings, ...rest } = venue;

      const newBookings = bookings.map((booking) => ({
        ...booking,
        start_time: booking.start_time?.toISOString(),
        end_time: booking.end_time?.toISOString(),
      }));

      return {
        ...rest,
        created_on: created_on?.toISOString(),
        updated_at: updated_at?.toISOString(),
        bookings: newBookings,
      };
    });
    return { success: formattedVenues };
  } catch (error) {
    return { error: "Error fetching venues" };
    throw error;
  }
};

export const editVenues = authAction(
  editVenueSchema,
  async ({ deleted, updated, added }: EditVenuesPayload, { userId }) => {
    try {
      await prisma.$transaction(
        async (prisma) => {
          // Delete venues
          if (deleted && deleted.length > 0) {
            await prisma.venue.updateMany({
              where: { id: { in: deleted } },
              data: { deleted: true, updated_at: new Date() },
            });
          }

          // Update venues
          if (updated && updated.length > 0) {
            for (const venue of updated) {
              await prisma.venue.update({
                where: { id: venue.id },
                data: {
                  name: venue.name,
                  updated_at: new Date(),
                },
              });
            }
          }

          // Add new venues
          if (added && added.length > 0) {
            await prisma.venue.createMany({
              data: added.map((venue) => ({
                name: venue.name,
                created_on: new Date(),
                updated_at: new Date(),
              })),
            });
          }
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        }
      );

      revalidatePath("/settigs");

      return { success: "Venues updated successfully" };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong while updating venues" };
    }
  }
);

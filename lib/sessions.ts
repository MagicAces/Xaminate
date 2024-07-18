"use server";

import prisma from "@/prisma/prisma";
import { Category, TempStatus } from "@prisma/client";
import { format } from "date-fns";
import { VenueBooking } from "@/types";
import { revalidatePath } from "next/cache";
export const checkSessionStatus = async () => {
  const now = new Date();

  const [pendingToActiveSessions, activeToClosedSessions] = await Promise.all([
    prisma.session.findMany({
      where: {
        temp_status: TempStatus.pending,
        start_time: { lte: now },
        end_time: { gte: now },
      },
    }),
    prisma.session.findMany({
      where: {
        temp_status: { in: [TempStatus.active, TempStatus.pending] },
        end_time: { lt: now },
      },
    }),
  ]);

  const pendingToActiveNotifications = pendingToActiveSessions.map(
    (session) => ({
      category: Category.Session,
      message: `Session #${session.id} has started. It will end at ${format(
        new Date(session.end_time),
        "h:mm a"
      )}`,
      read: false,
      category_id: session.id,
    })
  );

  const activeToClosedNotifications = activeToClosedSessions.map((session) => ({
    category: Category.Session,
    message: `Session #${session.id} has ended. It ended at ${format(
      new Date(session.end_time),
      "h:mm a"
    )}`,
    read: false,
    category_id: session.id,
  }));

  await prisma.$transaction([
    prisma.session.updateMany({
      where: {
        id: { in: pendingToActiveSessions.map((session) => session.id) },
      },
      data: { temp_status: "active" },
    }),
    prisma.session.updateMany({
      where: {
        id: { in: activeToClosedSessions.map((session) => session.id) },
      },
      data: {
        temp_status: "closed",
        actual_end_time: new Date(),
      },
    }),
    prisma.venueBooking.deleteMany({
      where: {
        venue_id: {
          in: activeToClosedSessions.map((session) => session.venue_id),
        },
      },
    }),
    prisma.notification.createMany({
      data: [...pendingToActiveNotifications, ...activeToClosedNotifications],
    }),
  ]);
};

export const isVenueAvailable = async (
  venueId: number,
  sessionStart: Date,
  sessionEnd: Date,
  bookings?: VenueBooking[],
  excludeSessionId?: number
): Promise<boolean> => {
  if (bookings) {
    const conflictingBookings = bookings.filter((booking) => {
      return (
        booking.venue_id === venueId &&
        new Date(booking.start_time) <= sessionEnd &&
        new Date(booking.end_time) >= sessionStart
      );
    });

    return conflictingBookings.length === 0;
  } else {
    const conflictingBookings = await prisma.venueBooking.findMany({
      where: {
        venue_id: venueId,
        NOT: excludeSessionId ? { session_id: excludeSessionId } : undefined,
        // OR: [
        //   {
        start_time: { lte: sessionEnd },
        end_time: { gte: sessionStart },
        //   },
        // ],
      },
    });
    console.log(conflictingBookings);
    return conflictingBookings.length === 0;
  }
};

const pathsToRevalidate = [
  "/", // Root path
  "/sessions",
  "/sessions/[id]",
  // Add more paths here if needed
];

export const revalidateAllPaths = async () => {
  try {
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
    }
  } catch (error) {
    console.error("Failed to revalidate paths:", error);
  }
};

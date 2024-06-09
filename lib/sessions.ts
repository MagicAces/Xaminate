"use server";

import prisma from "@/prisma/prisma";
import { Category, TempStatus } from "@prisma/client";
import { format } from "date-fns";

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
      data: { temp_status: "closed", actual_end_time: new Date() },
    }),
    prisma.notification.createMany({
      data: [...pendingToActiveNotifications, ...activeToClosedNotifications],
    }),
  ]);
};

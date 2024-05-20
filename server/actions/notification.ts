"use server";
import prisma from "@/prisma/prisma";
import { action } from "./actions";
import { emptySchema, markNotificationAsReadSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

// Fetch unread notifications

export const fetchUnread = async () => {
  try {
    const [count, data] = await Promise.all([
      prisma.notification.count({
        where: {
          read: false,
        },
      }),
      prisma.notification.findMany({
        take: 30,
        orderBy: {
          created_on: "desc",
        },
        where: {
          read: false,
        },
      }),
    ]);

    return { success: { data, count } };
  } catch (error) {
    throw error;
  }
};

export const getNotifications = async ({
  lastCursor,
  isUnread,
}: {
  lastCursor: number | null;
  isUnread: boolean;
}) => {
  try {
    const [totalCount, unreadCount, result] = await Promise.all([
      prisma.notification.count(),
      prisma.notification.count({
        where: {
          read: false,
        },
      }),
      prisma.notification.findMany({
        take: 10,
        ...(lastCursor && {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: lastCursor,
          },
        }),
        ...(isUnread && {
          where: {
            read: false,
          },
        }),
        orderBy: {
          created_on: "desc",
        },
      }),
    ]);

    if (result.length == 0) {
      return {
        data: [],
        metaData: {
          lastCursor: 0,
          hasNextPage: false,
        },
        totalCount,
        unreadCount,
      };
    }

    const lastPostInResults: any = result[result.length - 1];
    const cursor: number = lastPostInResults.id;

    const nextPage = await prisma.notification.findMany({
      // Same as before, limit the number of events returned by this query.
      take: 10,
      ...(isUnread && {
        where: {
          read: false,
        },
      }),
      skip: 1, // Do not include the cursor itself in the query result.
      cursor: {
        id: cursor,
      },
      orderBy: {
        created_on: "desc",
      },
    });

    return {
      data: result,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
      totalCount,
      unreadCount,
    };
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = action(
  markNotificationAsReadSchema,
  async ({ id }) => {
    try {
      await prisma.notification.update({
        where: {
          id: id,
        },
        data: {
          read: true,
        },
      });
      revalidatePath("/");
      return { success: "Notification marked as read" };
    } catch (error) {
      return { error: "Something went wrong" };
    }
  }
);

export const markNotificationAsSeen = async ({ id }: { id: number }) => {
  try {
    await prisma.notification.update({
      where: {
        id: id,
      },
      data: {
        read: true,
      },
    });
    return { success: "Notification marked as read" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const markNotificationsAsRead = action(emptySchema, async () => {
  try {
    await prisma.notification.updateMany({
      data: {
        read: true,
      },
    });
    revalidatePath("/");
    return { success: "Notifications marked as read" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
});

export const markNotificationsAsSeen = async () => {
  try {
    await prisma.notification.updateMany({
      data: {
        read: true,
      },
    });
    return { success: "Notifications marked as read" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

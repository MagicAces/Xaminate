"use server";

import prisma from "@/prisma/prisma";
import { Category, TempStatus } from "@prisma/client";
import { format } from "date-fns";
import { VenueBooking } from "@/types";
import { revalidatePath } from "next/cache";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  formatDuration,
  formatSorRDate,
  formatToCCTVTimestamp,
} from "@/utils/functs";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

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

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateSessionPDF = async (
  sessionId: number
): Promise<Uint8Array> => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      venue: true,
      creator: true,
      terminator: true,
      reports: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  const duration = session?.actual_end_time
    ? session?.start_time >= session.actual_end_time
      ? "Terminated"
      : formatDuration(session.start_time, session.end_time)
    : formatDuration(session?.start_time, session?.end_time);

  const docDefinition: any = {
    content: [
      {
        text: `Session #${session.id}`,
        fontSize: 24,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "black",
          },
        ],
        margin: [0, 0, 0, 10],
      },
      {
        columns: [
          [
            { text: "Start Time", bold: true },
            { text: `${formatSorRDate(session.start_time.toISOString())}` },
            { text: "           " }, // Gap
            { text: "Venue", bold: true },
            { text: `${session.venue.name}` },
            { text: "                          " }, // Gap
            { text: "End Time", bold: true },
            { text: `${formatSorRDate(session.end_time.toISOString())}` },
          ],
          [
            { text: "Planned Duration", bold: true },
            { text: `${duration}` },
            { text: "            " }, // Gap
            { text: "Actual End Time", bold: true },
            {
              text: `${
                session?.actual_end_time
                  ? formatSorRDate(session.actual_end_time?.toISOString())
                  : "N/A"
              }`,
            },
            { text: "               " }, // Gap
            { text: "Actual Duration", bold: true },
            {
              text: `${
                session?.actual_end_time
                  ? formatDuration(session.start_time, session.actual_end_time)
                  : "N/A"
              }`,
            },
          ],
        ],
        columnGap: 20,
        margin: [0, 20, 0, 0],
        layout: {
          defaultBorder: false,
        },
      },
      {
        text: "Course(s):",
        bold: true,
        margin: [0, 20, 0, 5],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "black",
          },
        ],
        margin: [0, 0, 0, 5],
      },
      ...session.course_names.map((course, index) => ({
        text: `${index + 1}. ${course} - ${session.course_codes[index]}`,
        margin: [0, 0, 0, 5],
      })),
      {
        text: "Invigilator(s):",
        bold: true,
        margin: [0, 20, 0, 5],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "black",
          },
        ],
        margin: [0, 0, 0, 5],
      },
      ...session.invigilators.map((invigilator, index) => ({
        text: `${index + 1}. ${invigilator}`,
        margin: [0, 0, 0, 5],
      })),
      {
        text: "Class(es):",
        bold: true,
        margin: [0, 20, 0, 5],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "black",
          },
        ],
        margin: [0, 0, 0, 5],
      },
      ...session.classes.map((className, index) => ({
        text: `${index + 1}. ${className}`,
        margin: [0, 0, 0, 5],
      })),
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "black",
          },
        ],
        margin: [0, 10, 0, 5],
      },
      {
        columns: [
          [
            { text: "Created By", bold: true },
            {
              text: `${session.creator?.first_name} ${session.creator?.last_name}`,
            },
            { text: "               " }, // Gap
            { text: "Terminated By", bold: true },
            {
              text: session.terminator
                ? `${session.terminator.first_name} ${session.terminator.last_name}`
                : "N/A",
            },
          ],
          [
            { text: "Created On", bold: true },
            { text: `${formatSorRDate(session.created_on?.toISOString())}` },
            { text: "                  " }, // Gap
            { text: "Last Updated", bold: true },
            { text: `${formatSorRDate(session.updated_at?.toISOString())}` },
          ],
        ],
        columnGap: 20,
        margin: [0, 5, 0, 10],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "black",
          },
        ],
        margin: [0, 0, 0, 5],
      },
      {
        text: `Reports (${session.reports.length})`,
        bold: true,
        margin: [0, 15, 0, 5],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "black",
          },
        ],
        margin: [0, 0, 0, 5],
      },
      {
        table: {
          widths: ["*"],
          body: session.reports.reduce((acc, report, index) => {
            const studentName = `${report.student?.first_name || ""} ${
              report.student?.last_name || ""
            }`;
            const row = [
              [
                {
                  text: [
                    { text: "Name: ", bold: true },
                    studentName,
                    "\n\n",
                    { text: "        " },
                    { text: "ID: ", bold: true },
                    report.student?.index_number.toString() || "",
                    "\n\n",
                    { text: "        " },
                    { text: "Status: ", bold: true },
                    report.status.toString(),
                    "\n\n",
                    { text: "        " },
                    { text: "Program: ", bold: true },
                    report.student?.program || "",
                    "\n\n",
                    { text: "        " },
                    { text: "Timestamp: ", bold: true },
                    report.timestamp.toLocaleString(),
                  ],
                  margin: [5, 10, 5, 10],
                },
              ],
              [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 515,
                      y2: 0,
                      lineWidth: 1,
                      lineColor: "gray",
                    },
                  ],
                  margin: [0, 0, 0, 10],
                },
              ], // Gap between reports
            ];
            acc.push(...row);
            return acc;
          }, [] as any[]),
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },
    ],
    defaultStyle: {
      font: "Roboto",
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 15,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
    footer: {
      columns: [
        {
          text: `@Copyright ${new Date().getFullYear()}, Xaminate`,
          fontSize: 10,
          alignment: "center",
          color: "gray",
        },
      ],
      margin: [0, 0, 0, 10],
      // absolutePosition: { x: 0, y:  }, // Adjust footer position
    },
  };

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  return new Promise<Uint8Array>((resolve, reject) => {
    pdfDocGenerator.getBuffer((buffer: Buffer) => {
      resolve(new Uint8Array(buffer));
    });
  });
};

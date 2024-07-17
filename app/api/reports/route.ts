import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { newReportSchema } from "@/lib/schema";
import { ZodError } from "zod";

export const revalidate = 60;
// export const runtime = "edge";

// 2 approaches
// First is a webhook, that receives a payload from the camera, in the form of a new report.

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const adminToken = process.env.ADMIN_TOKEN;

    const authorizationHeader = request.headers.get("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }
    const token = authorizationHeader.split(" ")[1];

    if (token !== adminToken) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await newReportSchema.parseAsync(await request.json());

    let student_id = undefined;

    if (data.student_identified) {
      const foundStudent = await prisma.student.findUnique({
        where: {
          reference_no: data.student_reference_no,
        },
        select: {
          id: true,
        },
      });

      student_id = foundStudent?.id || undefined;
    }

    const foundSession = await prisma.session.findUnique({
      where: {
        id: data.session_id,
      },
    });

    if (!foundSession) {
      return NextResponse.json(
        { status: "error", message: "Session ID not valid" },
        { status: 401 }
      );
    }

    if (
      foundSession.end_time < new Date() ||
      foundSession.temp_status === "closed"
    ) {
      return NextResponse.json(
        { status: "error", message: "Session has ended" },
        { status: 401 }
      );
    }

    const foundCamera = await prisma.camera.findUnique({
      where: {
        id: data.camera_id,
      },
    });

    if (!foundCamera) {
      return NextResponse.json(
        { status: "error", message: "Camera ID not valid" },
        { status: 401 }
      );
    }

    const newReport = await prisma.report.create({
      data: {
        student_id: student_id,
        description: data.description,
        snapshot_url: data.snapshot_url || "",
        session_id: data.session_id,
        timestamp: data.timestamp,
        camera_id: data.camera_id,
      },
    });

    return NextResponse.json(
      {
        message: "Report created successfully",
        report: newReport,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation Failed",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: "error", message: error?.message },
      { status: 400 }
    );
  }
}

// Second is polling, querying their api, to give us new reports. If it

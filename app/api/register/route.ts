import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { hash } from "bcryptjs";
import { registerSchema } from "@/lib/schema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    // Retrieve the value of the ADMIN_TOKEN environment variable
    const adminToken = process.env.ADMIN_TOKEN;

    // Check if the request headers contain a bearer token
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract the token from the authorization header
    const token = authorizationHeader.split(" ")[1];

    // Compare the token with the ADMIN_TOKEN
    if (token !== adminToken) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await registerSchema.parseAsync(await req.json());
    const passwordHash = await hash(data.password, 12);

    const newUser = await prisma.examsOfficer.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: passwordHash,
      },
    });

    console.log(newUser);

    return NextResponse.json({
      message: "User Successfully Registered",
      user: {
        id: newUser.id.toString(),
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
      },
    });
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

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          status: "fail",
          message: "Email exists already",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

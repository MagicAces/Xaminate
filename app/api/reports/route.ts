import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";


export const revalidate = 60;
export const runtime = 'edge';

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
        
      const report = await request.json();
    } catch (error) {
        
    }
}


// Second is polling, querying their api, to give us new reports. If it 
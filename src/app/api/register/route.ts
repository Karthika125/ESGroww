import { prisma } from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      hospitalName,
      industry,
      email,
      password,
      numberOfBeds,
      builtUpArea,
    } = body;

    /* ====================== */
    /* VALIDATION             */
    /* ====================== */

    if (
      !hospitalName ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields.",
        },
        { status: 400 }
      );
    }

    /* ====================== */
    /* CHECK EXISTING USER    */
    /* ====================== */

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "Email already registered.",
        },
        { status: 400 }
      );
    }

    /* ====================== */
    /* CREATE HOSPITAL        */
    /* ====================== */

    const hospital =
      await prisma.hospital.create({
        data: {
          hospitalName,

          industry,

          numberOfBeds,

          builtUpArea,
        },
      });

    /* ====================== */
    /* CREATE USER            */
    /* ====================== */

    const user =
      await prisma.user.create({
        data: {
          email,

          password,

          hospitalId:
            hospital.id,

          role: "hospital",
        },
      });

    return NextResponse.json({
      success: true,

      userId: user.id,

      hospitalId: hospital.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Registration failed.",
      },
      { status: 500 }
    );
  }
}


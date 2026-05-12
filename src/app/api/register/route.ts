import { prisma } from "@/lib/db";

import bcrypt from "bcryptjs";

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
          success: false,
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
          success: false,
          error:
            "Email already registered.",
        },
        { status: 400 }
      );
    }

    /* ====================== */
    /* HASH PASSWORD          */
    /* ====================== */

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    /* ====================== */
    /* CREATE HOSPITAL        */
    /* ====================== */

    const hospital =
      await prisma.hospital.create({
        data: {
          hospitalName,

          industry:
            industry ||
            "Healthcare",

          numberOfBeds:
            Number(numberOfBeds) ||
            0,

          builtUpArea:
            Number(builtUpArea) ||
            0,
        },
      });

    /* ====================== */
    /* CREATE USER            */
    /* ====================== */

    const user =
      await prisma.user.create({
        data: {
          email,

          password:
            hashedPassword,

          hospitalId:
            hospital.id,

          role: "hospital",
        },
      });

    return NextResponse.json({
      success: true,

      message:
        "Registration successful.",

      userId: user.id,

      hospitalId:
        hospital.id,
    });
  } catch (error) {
    console.error(
      "Register API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Registration failed.",
      },
      { status: 500 }
    );
  }
}
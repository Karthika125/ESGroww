import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest
) {

  const token =
    request.nextUrl.searchParams.get(
      "token"
    );

  if (!token) {
    return NextResponse.redirect(
      new URL(
        "/login?error=invalid-token",
        request.url
      )
    );
  }

  const user =
    await prisma.user.findFirst({
      where: {
        emailVerificationToken:
          token,
      },

      include: {
        hospital: true,
      },
    });

  if (!user) {
    return NextResponse.redirect(
      new URL(
        "/login?error=invalid-token",
        request.url
      )
    );
  }

  if (
    !user.emailVerificationExpiry ||
    user.emailVerificationExpiry <
      new Date()
  ) {
    return NextResponse.redirect(
      new URL(
        "/login?error=expired-token",
        request.url
      )
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      emailVerified: true,

      emailVerificationToken:
        null,

      emailVerificationExpiry:
        null,
    },
  });

  await prisma.hospital.update({
    where: {
      id: user.hospitalId,
    },

    data: {
      accountStatus: "Active",
    },
  });

  return NextResponse.redirect(
    new URL(
      "/login?verified=true",
      request.url
    )
  );
}
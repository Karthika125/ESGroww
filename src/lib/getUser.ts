import { cookies } from "next/headers";

import { verifyToken } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const decoded =
    verifyToken(token);

  return decoded;
}
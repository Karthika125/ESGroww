"use client";

import { usePathname } from "next/navigation";
import VerticalFloatingMenu from "@/components/ui/VerticalFloatingMenu";

export default function VerticalFloatingMenuWrapper() {
  const pathname = usePathname();

  if (!pathname) return null;

  // hide on auth pages and admin console
  const hide = ["/login", "/register"];
  if (hide.includes(pathname) || hide.some((p) => pathname.startsWith(p + "/"))) return null;
  if (pathname.startsWith("/admin")) return null;

  return <VerticalFloatingMenu />;
}

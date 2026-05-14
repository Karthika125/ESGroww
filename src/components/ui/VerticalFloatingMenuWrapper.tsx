"use client";

import { usePathname } from "next/navigation";
import VerticalFloatingMenu from "@/components/ui/VerticalFloatingMenu";

export default function VerticalFloatingMenuWrapper() {
  const pathname = usePathname();

  if (!pathname) return null;

  // hide on public pages
  const hide = ["/", "/login", "/register"];
  if (hide.includes(pathname) || hide.some((p) => pathname.startsWith(p + "/"))) return null;

  return <VerticalFloatingMenu />;
}

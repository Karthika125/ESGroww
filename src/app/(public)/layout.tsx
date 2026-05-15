import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "ESGroww | Sustainability Readiness Platform",
    template: "%s | ESGroww",
  },
  description:
    "Enterprise ESG Readiness Intelligence Platform. Assessing, calculating, and scoring sustainability data.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex w-full min-w-0 flex-col">{children}</div>;
}

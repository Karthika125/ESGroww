"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Compass,
  BarChart2,
  Gauge,
  BookOpen,
  User,
  X,
  LogOut,
  TrendingUp,
} from "lucide-react";

type MenuItem = {
  key: string;
  label: string;
  Icon: React.ElementType;
  href?: string;
  onClick?: () => void;
};

export default function VerticalFloatingMenu() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const items: MenuItem[] = [
    { key: "where", label: "Where I stand", Icon: MapPin, href: "/where-i-stand" },
    { key: "kpi", label: "KPI", Icon: BarChart2, href: "/kpi" },
    { key: "analysis", label: "Analysis", Icon: TrendingUp, href: "/analysis" },
    { key: "metrics", label: "Completeness & Confidence", Icon: Gauge, href: "/metrics" },
    { key: "glossary", label: "Glossary & Abbreviation", Icon: BookOpen, href: "/glossary" },
    { key: "logout", label: "Logout", Icon: LogOut, onClick: async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {
        // ignore
      }
    } },
  ];

  const onNavigate = useCallback(
    (href: string) => {
      router.push(href);
      setIsProfileOpen(false);
    },
    [router]
  );

  return (
    <>
      {/* Profile (Top-right) — positioned absolute so it scrolls with the page */}
      <div className="absolute right-4 top-6 z-50 sm:right-6 sm:top-8 lg:right-8">
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((p) => !p)}
            className="group flex flex-col items-center gap-2"
            aria-expanded={isProfileOpen}
            aria-label="Open menu"
          >
            <div
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/45 bg-white/20 text-foreground shadow-[0_12px_32px_rgba(15,23,42,0.14)] backdrop-blur-xl ring-1 ring-white/35 sm:h-14 sm:w-14 transition-transform duration-300 hover:scale-105 hover:rotate-2 hover:text-[#004D7C]"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.42), rgba(255,255,255,0.12))",
                animation: "floating-menu-bob 4.5s ease-in-out infinite",
              }}
            >
              <style>{`
                @keyframes floating-menu-bob {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-2px); }
                }
              `}</style>
              <span className="absolute inset-0 rounded-full border border-white/50 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 via-white/10 to-transparent opacity-80" />

              <div className="relative z-10 transition-transform duration-300 hover:scale-105">
                <User size={22} />
              </div>
            </div>
          </button>

          {/* Menu items shown under profile (replacing hamburger) */}
          <div
            className={`absolute left-0 top-full z-50 mt-3 flex flex-col items-start gap-2.5 overflow-hidden transition-all duration-200 ${
              isProfileOpen ? "max-h-[420px] opacity-100 translate-y-0" : "pointer-events-none max-h-0 opacity-0 -translate-y-2"
            }`}
          >
            {items.map((item) => {
              const Icon = item.Icon;
              return (
                <button
                  key={item.key}
                  onClick={async () => {
                    setIsProfileOpen(false);
                    if (item.onClick) {
                      await item.onClick();
                      router.push('/login');
                    } else if (item.href) {
                      onNavigate(item.href);
                    }
                  }}
                  className="group relative flex h-11 w-11 items-center justify-center overflow-visible rounded-full border border-white/40 bg-white/18 text-foreground shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur-xl ring-1 ring-white/30 transition-all duration-300 hover:-translate-x-1 hover:scale-105 hover:text-[#004D7C] sm:h-12 sm:w-12"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.38), rgba(255,255,255,0.08))" }}
                >
                  <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute inset-0 rounded-full border border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" />

                  <div className="relative z-10 transition-transform duration-300 group-hover:rotate-[-4deg]">
                    <Icon size={16} className="transition-colors duration-300" />
                  </div>

                  <span className="pointer-events-none absolute right-full mr-2.5 w-max whitespace-nowrap rounded-md border border-white/15 bg-slate-950/80 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:-translate-x-0.5 group-hover:opacity-100 sm:mr-3 sm:px-3 sm:py-1.5">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
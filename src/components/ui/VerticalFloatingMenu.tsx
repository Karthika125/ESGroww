"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
  import { AnimatePresence, motion } from "framer-motion";
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
    { key: "next", label: "What next", Icon: Compass, href: "/what-next" },
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
      <div className="absolute top-8 right-8 z-50">
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((p) => !p)}
            className="group flex flex-col items-center gap-2"
            aria-expanded={isProfileOpen}
            aria-label="Open menu"
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl">
              <span className="absolute inset-0 rounded-full border border-white" />

              <User size={22} />
            </div>
          </button>

          {/* Menu items shown under profile (replacing hamburger) */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 top-full mt-3 z-50 flex flex-col items-start gap-3"
              >
                {items.map((item) => {
                  const Icon = item.Icon;
                  return (
                    <motion.button
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
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.03, duration: 0.2 }}
                      whileHover={{ scale: 1.06, y: -2 }}
                      className="group relative flex h-12 w-12 items-center justify-center overflow-visible rounded-full border border-white/25 bg-white/10 shadow-lg backdrop-blur-md transition-colors duration-300 hover:bg-white"
                    >
                      <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

                      <Icon size={16} className="relative z-10 text-black transition-colors duration-300 group-hover:text-white" />

                      <span className="pointer-events-none absolute right-full mr-3 w-max whitespace-nowrap rounded-md bg-black/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-100 text-right">
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
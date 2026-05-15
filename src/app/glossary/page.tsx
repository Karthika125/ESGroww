"use client";

import { useMemo, useState } from "react";
import { glossaryData } from "@/lib/glossaryData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Cloud,
  Key,
  Zap,
  Droplet,
  Layers,
  FlaskRound,
  ShieldCheck,
  Users,
  Globe,
  TrendingUp,
} from "lucide-react";

export default function GlossaryPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return glossaryData;
    return glossaryData.filter((g) => {
      return (
        g.term.toLowerCase().includes(term) ||
        (g.abbreviation || "").toLowerCase().includes(term) ||
        g.definition.toLowerCase().includes(term)
      );
    });
  }, [q]);

  const getIconFor = (term: string, abbreviation?: string) => {
    const key = (abbreviation || term).toLowerCase();
    const map: Record<string, any> = {
      brsr: BookOpen,
      gri: BookOpen,
      issb: BookOpen,
      cdp: Cloud,
      kwh: Zap,
      kl: Droplet,
      "tco₂e": Cloud,
      tco2e: Cloud,
      cpcb: ShieldCheck,
      fssai: ShieldCheck,
      jwt: Key,
      capa: FileText,
      haccp: FlaskRound,
      rohs: FlaskRound,
      zdhc: FlaskRound,
      leed: BookOpen,
      nabh: ShieldCheck,
      "scope 1": Layers,
      "scope 2": Layers,
      "scope 3": Layers,
      stp: Droplet,
      sroi: TrendingUp,
      igbc: Globe,
    };

    for (const k of [key, term.toLowerCase()]) {
      if (map[k]) return map[k];
    }

    // keyword fallbacks
    if (term.toLowerCase().includes("carbon")) return Cloud;
    if (term.toLowerCase().includes("energy") || term.toLowerCase().includes("kwh")) return Zap;
    if (term.toLowerCase().includes("water") || term.toLowerCase().includes("kl")) return Droplet;
    if (term.toLowerCase().includes("building") || term.toLowerCase().includes("leed") || term.toLowerCase().includes("green")) return BookOpen;

    return null;
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3d5248]/80">Resources</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#15221a]">Glossary & Abbreviations</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#3d5248]">Common terms and abbreviations used across the platform.</p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search terms or definitions..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-9 w-full max-w-2xl bg-white/80 text-sm"
          />
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((g) => (
            <Card key={g.term} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#00673F]/10 text-[#00673F] font-semibold">
                    {(() => {
                      const Icon = getIconFor(g.term, g.abbreviation);
                      if (Icon) return <Icon className="h-5 w-5" />;
                      return <span className="text-sm font-semibold">{g.term.charAt(0)}</span>;
                    })()}
                  </div>
                  <CardTitle className="text-base">{g.term}</CardTitle>
                  {g.abbreviation && <Badge variant="outline" className="ml-auto text-[11px] uppercase">{g.abbreviation}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>{g.definition}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}

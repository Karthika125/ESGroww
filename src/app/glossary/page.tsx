"use client";

import { useMemo, useState } from "react";
import { glossaryData } from "@/lib/glossaryData";

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

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Glossary & Abbreviations</h1>
        <p className="text-slate-600 mb-6">Common terms and abbreviations used across the platform.</p>

        <div className="mb-6 flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms or definitions..."
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((g) => (
            <article key={g.term} className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold leading-none">{g.term}</h3>
                {g.abbreviation && <span className="text-xs text-slate-500">{g.abbreviation}</span>}
              </div>
              <p className="mt-2 text-sm text-slate-700">{g.definition}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

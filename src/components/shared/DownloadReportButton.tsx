"use client";

import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

export interface DownloadReportData {
  orgName?: string;
  sector?: string;
  overallScore: number;
  readinessStage: string;
  completeness: number;
  confidence: number;
  totalEmissions: number;
  annualizedValues: { electricity: number; water: number; fuel: number; waste: number };
  certificationReadiness: Record<string, boolean | number>;
  categoryScores?: { energy: number; water: number; waste: number; governance: number };
  emissions?: { scope1: number; scope2: number; scope3: number };
  strengths?: string[];
  gaps?: { text: string; severity: "High" | "Medium" | "Low" }[];
  regulatoryReadiness?: { regulation: string; readiness: number; risk: "Low" | "Medium" | "Medium-High" | "High" }[];
  roadmap?: { action: string; timeline: string; impact: string }[];
}

interface DownloadReportButtonProps {
  data: DownloadReportData;
  className?: string;
  label?: string;
  disabled?: boolean;
}

function formatValue(value: number, decimals = 0) {
  return value.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

function ensurePageSpace(doc: jsPDF, currentY: number, needed: number) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + needed > pageHeight - 40) {
    doc.addPage();
    return 40;
  }
  return currentY;
}

export function DownloadReportButton({ data, className, label = "Download PDF Report", disabled = false }: DownloadReportButtonProps) {
  const safeFileName = () => {
    const name = data.orgName ? data.orgName.replace(/[^a-zA-Z0-9\- ]/g, "").trim() : "SAM-ESG-Assessment";
    return `${name.replace(/\s+/g, "-") || "SAM-ESG-Assessment"}-ESG-Report.pdf`;
  };

  const handleDownload = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const margin = 40;
    let y = margin;
    const reportDate = new Date().toLocaleDateString();

    doc.setFillColor(6, 78, 59);
    doc.rect(0, 0, width, 88, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#ffffff");
    doc.text("SAM Corporate", margin, 34);

    doc.setFontSize(10);
    doc.text("Sustainability Advisory | ESG Assessment Report", margin, 52);
    doc.setTextColor("#d1fae5");
    doc.text(`Date: ${reportDate}`, width - margin, 34, { align: "right" });
    doc.text(`Prepared for: ${data.orgName ?? "Client"}`, width - margin, 52, { align: "right" });

    y = 110;
    doc.setTextColor("#0f172a");
    doc.setFontSize(16);
    doc.text("Executive Summary", margin, y);
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summaryText = `This report captures the results of the ESG readiness assessment from the results dashboard. ${data.orgName ?? "The organization"} operates in the ${data.sector ?? "sector"} sector and has an overall readiness score of ${formatValue(data.overallScore, 0)} (${data.readinessStage}).`;
    const summaryLines = doc.splitTextToSize(summaryText, width - margin * 2);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 14 + 14;

    y = ensurePageSpace(doc, y, 120);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Assessment Summary", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const metricRows = [
      ["Sector", data.sector ?? "-"],
      ["Readiness Stage", data.readinessStage],
      ["Score", formatValue(data.overallScore, 0)],
      ["Completeness", `${formatValue(data.completeness, 0)}%`],
      ["Confidence", `${formatValue(data.confidence * 100, 0)}%`],
      ["Total Emissions", `${formatValue(data.totalEmissions, 1)} tCO₂e`],
    ];
    metricRows.forEach(([label, value]) => {
      doc.text(label, margin, y);
      doc.text(String(value), width - margin, y, { align: "right" });
      y += 16;
    });

    y += 8;
    y = ensurePageSpace(doc, y, 120);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Annualized Operational Metrics", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const annualMetrics = [
      ["Electricity", `${formatValue(data.annualizedValues.electricity)} kWh`],
      ["Water", `${formatValue(data.annualizedValues.water)} KL`],
      ["Fuel", `${formatValue(data.annualizedValues.fuel)} L`],
      ["Waste", `${formatValue(data.annualizedValues.waste)} kg`],
    ];
    annualMetrics.forEach(([label, value]) => {
      doc.text(`${label}:`, margin, y);
      doc.text(value, width - margin, y, { align: "right" });
      y += 14;
    });

    y += 10;
    y = ensurePageSpace(doc, y, 120);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Category Scores", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const categories = [
      ["Energy", data.categoryScores?.energy ?? 0],
      ["Water", data.categoryScores?.water ?? 0],
      ["Waste", data.categoryScores?.waste ?? 0],
      ["Governance", data.categoryScores?.governance ?? 0],
    ];
    categories.forEach(([label, value]) => {
      doc.text(`${label}:`, margin, y);
      doc.text(`${formatValue(Number(value), 0)}`, width - margin, y, { align: "right" });
      y += 14;
    });

    y += 10;
    y = ensurePageSpace(doc, y, 140);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Emissions Breakdown", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const emissions = data.emissions ?? { scope1: 0, scope2: 0, scope3: 0 };
    [["Scope 1", emissions.scope1], ["Scope 2", emissions.scope2], ["Scope 3", emissions.scope3]].forEach(([label, value]) => {
      doc.text(`${label}:`, margin, y);
      doc.text(`${formatValue(Number(value), 1)} tCO₂e`, width - margin, y, { align: "right" });
      y += 14;
    });

    y += 12;
    y = ensurePageSpace(doc, y, 160);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Certification Readiness", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const certEntries = Object.entries(data.certificationReadiness).slice(0, 6);
    if (certEntries.length === 0) {
      doc.text("No certification readiness data available.", margin, y);
      y += 14;
    } else {
      certEntries.forEach(([cert, value]) => {
        const score = typeof value === "number" ? value : value ? 75 : 45;
        doc.text(`${cert}:`, margin, y);
        doc.text(`${formatValue(score, 0)}%`, width - margin, y, { align: "right" });
        y += 14;
      });
    }

    y += 12;
    y = ensurePageSpace(doc, y, 160);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Regulatory Readiness", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const regulations = data.regulatoryReadiness ?? [];
    if (regulations.length === 0) {
      doc.text("Regulatory readiness data is not available.", margin, y);
      y += 14;
    } else {
      regulations.slice(0, 4).forEach((reg) => {
        const line = `${reg.regulation}: ${formatValue(reg.readiness, 0)}% (${reg.risk})`;
        const wrapped = doc.splitTextToSize(line, width - margin * 2);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 14;
      });
    }

    y += 14;
    y = ensurePageSpace(doc, y, 160);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Priority Roadmap", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const roadmapItems = data.roadmap ?? [];
    if (roadmapItems.length === 0) {
      doc.text("No roadmap items available.", margin, y);
      y += 14;
    } else {
      roadmapItems.slice(0, 4).forEach((item) => {
        const line = `${item.timeline}: ${item.action} — ${item.impact}`;
        const wrapped = doc.splitTextToSize(line, width - margin * 2);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 14;
      });
    }

    y += 14;
    y = ensurePageSpace(doc, y, 160);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Key Strengths", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const strengths = data.strengths ?? [];
    if (strengths.length === 0) {
      doc.text("No strengths data available.", margin, y);
      y += 14;
    } else {
      strengths.slice(0, 4).forEach((item) => {
        const wrapped = doc.splitTextToSize(`• ${item}`, width - margin * 2);
        doc.text(wrapped, margin + 8, y);
        y += wrapped.length * 14;
      });
    }

    y += 10;
    y = ensurePageSpace(doc, y, 160);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Key Gaps", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const gaps = data.gaps ?? [];
    if (gaps.length === 0) {
      doc.text("No gap analysis available.", margin, y);
      y += 14;
    } else {
      gaps.slice(0, 4).forEach((gap) => {
        const wrapped = doc.splitTextToSize(`• ${gap.text} (${gap.severity})`, width - margin * 2);
        doc.text(wrapped, margin + 8, y);
        y += wrapped.length * 14;
      });
    }

    y += 14;
    y = ensurePageSpace(doc, y, 120);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Recommended Next Steps", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    const nextSteps = [
      "Consolidate ESG datasets to improve completeness and scoring accuracy.",
      "Prioritize renewable energy, emissions reductions, and water recycling initiatives.",
      "Strengthen governance documentation and certification readiness actions.",
    ];
    nextSteps.forEach((step) => {
      const wrapped = doc.splitTextToSize(step, width - margin * 2);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14;
    });

    y = ensurePageSpace(doc, y, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor("#64748b");
    doc.text("SAM Corporate | ESG intelligence, regulatory readiness, and sustainability advisory.", margin, height - 30);

    doc.save(safeFileName());
  };

  return (
    <Button variant="default" className={className} onClick={handleDownload} disabled={disabled}>
      {label}
    </Button>
  );
}

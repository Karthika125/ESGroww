'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Award, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Certification {
  framework: string;
  readinessScore: number;
  statusLabel: string;
  majorGap: string;
  recommendedTimeline: string;
  prerequisites: string[];
}

export default function CertificationsPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  async function fetchCertifications() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/certifications');
      if (!response.ok) throw new Error('Failed to fetch certifications');
      const data = await response.json();
      setHospitals(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Advanced':
        return 'bg-emerald-600 text-white';
      case 'Strong Readiness':
        return 'bg-emerald-500 text-white';
      case 'Certification Possible':
        return 'bg-amber-600 text-white';
      case 'Foundational':
        return 'bg-orange-600 text-white';
      case 'Not Ready':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const getCertifications = (): Certification[] => [
    {
      framework: 'IGBC Healthcare',
      readinessScore: 82,
      statusLabel: 'Strong Readiness',
      majorGap: 'STP water reuse <15%',
      recommendedTimeline: '6–12M',
      prerequisites: ['Energy tracking ✓', 'Water metering ✓', 'Biomedical vendor ✓'],
    },
    {
      framework: 'LEED Healthcare',
      readinessScore: 78,
      statusLabel: 'Strong Readiness',
      majorGap: 'IAQ monitoring system',
      recommendedTimeline: '3–6M',
      prerequisites: ['Energy monitoring ✓', 'Water metering ✓', 'Waste tracking ✓'],
    },
    {
      framework: 'NABH',
      readinessScore: 85,
      statusLabel: 'Advanced',
      majorGap: 'None major',
      recommendedTimeline: '<3M',
      prerequisites: ['Biomedical waste ✓', 'Infection control ✓', 'Daily disposal ✓'],
    },
    {
      framework: 'ISO 14001',
      readinessScore: 72,
      statusLabel: 'Certification Possible',
      majorGap: 'Environmental policy audit',
      recommendedTimeline: '3–6M',
      prerequisites: ['Policy drafted ✓', 'ESG owner assigned ✓', 'Compliance register ✓'],
    },
    {
      framework: 'WELL',
      readinessScore: 65,
      statusLabel: 'Foundational',
      majorGap: 'IAQ monitoring system',
      recommendedTimeline: '12–18M',
      prerequisites: ['IAQ system missing', 'Thermal comfort monitoring'],
    },
    {
      framework: 'BRSR',
      readinessScore: 68,
      statusLabel: 'Foundational',
      majorGap: 'Scope 3 tracking incomplete',
      recommendedTimeline: '6–12M',
      prerequisites: ['Scope 1 & 2 ✓', 'ESG policy ✓', 'Scope 3 partial'],
    },
  ];

  const certifications = getCertifications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Certification Readiness</h1>
          <p className="text-slate-400">
            NABH, IGBC, LEED, ISO 14001, WELL, BRSR readiness scores, status badges, prerequisites and timelines
          </p>
        </div>

        {/* BRD Info */}
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex gap-3">
          <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-emerald-300 font-medium mb-1">Certification Intelligence</p>
            <p className="text-xs text-emerald-200">
              Scores are weighted by category (Energy, Water, Waste, Governance, Evidence). Prerequisites must be met to reach certification thresholds.
            </p>
          </div>
        </div>

        {/* Hospital Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">Filter by Organization:</label>
          <select
            value={selectedHospital}
            onChange={e => setSelectedHospital(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value="all">All Organizations</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Certifications Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <div className="w-8 h-8 border-3 border-slate-700 border-t-emerald-500 rounded-full"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
            Error: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all"
              >
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{cert.framework}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(cert.statusLabel)}`}>
                    {cert.statusLabel}
                  </span>
                </div>

                {/* Readiness Score */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Readiness Score</span>
                    <span className="text-2xl font-bold text-slate-100">{cert.readinessScore}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cert.readinessScore >= 75
                          ? 'bg-emerald-500'
                          : cert.readinessScore >= 60
                          ? 'bg-amber-500'
                          : cert.readinessScore >= 40
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${cert.readinessScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Major Gap */}
                <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-1">Major Gap</p>
                      <p className="text-sm text-slate-200">{cert.majorGap}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-xs font-semibold text-emerald-400 mb-1">Recommended Timeline</p>
                  <p className="text-sm text-emerald-300">{cert.recommendedTimeline}</p>
                </div>

                {/* Prerequisites */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Prerequisites</p>
                  <div className="space-y-2">
                    {cert.prerequisites.map((prereq, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {prereq}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Score Legend */}
        <div className="mt-12 p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Score Interpretation</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div>
              <div className="h-3 bg-emerald-600 rounded-full mb-2"></div>
              <p className="text-slate-300">90–100: Advanced</p>
            </div>
            <div>
              <div className="h-3 bg-emerald-500 rounded-full mb-2"></div>
              <p className="text-slate-300">75–89: Strong</p>
            </div>
            <div>
              <div className="h-3 bg-amber-600 rounded-full mb-2"></div>
              <p className="text-slate-300">60–74: Possible</p>
            </div>
            <div>
              <div className="h-3 bg-orange-600 rounded-full mb-2"></div>
              <p className="text-slate-300">40–59: Foundation</p>
            </div>
            <div>
              <div className="h-3 bg-red-600 rounded-full mb-2"></div>
              <p className="text-slate-300">&lt;40: Not Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

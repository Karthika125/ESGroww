'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Database, BarChart3, Settings } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState({
    hospitals: 0,
    esgScore: 0,
    uploads: 0,
    frameworks: 0,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats({
        hospitals: data.hospitals || 0,
        esgScore: Math.round(data.esgScore || 0),
        uploads: data.uploads || 0,
        frameworks: data.frameworks || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with gradient background */}
        <div className="mb-12 relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                ESG Admin Dashboard
              </h1>
              <p className="text-slate-400 mt-3 text-lg max-w-2xl leading-relaxed">
                Central intelligence hub for ESG monitoring, calculations, uploads, risk analysis, and certification readiness across all organizations.
              </p>
            </div>
            <div className="hidden xl:flex items-center gap-2 text-sm text-slate-400">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>System Live</span>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="flex gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last sync: Just now
            </span>
            <span>•</span>
            <span>Status: Operational</span>
          </div>
        </div>

        {/* Key Metrics Cards - Grid 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Organizations"
            value={stats.hospitals.toString()}
            subtitle="Registered facilities"
            icon={<Database className="w-5 h-5" />}
            color="emerald"
            trend={stats.hospitals > 0 ? '+1' : '0'}
          />

          <StatCard
            title="Avg ESG Score"
            value={`${stats.esgScore}%`}
            subtitle="Overall readiness"
            icon={<TrendingUp className="w-5 h-5" />}
            color="cyan"
            statusBadge={getScoreBadge(stats.esgScore)}
          />

          <StatCard
            title="Data Uploads"
            value={stats.uploads.toString()}
            subtitle="Operational datasets"
            icon={<BarChart3 className="w-5 h-5" />}
            color="amber"
            trend={stats.uploads > 0 ? '+' + stats.uploads : '0'}
          />

          <StatCard
            title="Frameworks"
            value={stats.frameworks.toString()}
            subtitle="Certifications tracked"
            icon={<CheckCircle className="w-5 h-5" />}
            color="violet"
          />
        </div>

        {/* Navigation Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            Admin Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminNavCard
              title="Hospitals"
              description="View organization profiles, sectors, built-up areas, account status and regulatory compliance."
              href="/admin/hospitals"
              icon={<Database className="w-6 h-6" />}
              color="emerald"
              stats={`${stats.hospitals} registered`}
            />

            <AdminNavCard
              title="Calculations"
              description="Annualization formulas, confidence modifiers, KPI benchmarks, validation rules and emissions calculations."
              href="/admin/calculations"
              icon={<BarChart3 className="w-6 h-6" />}
              color="cyan"
              stats="All categories"
            />

            <AdminNavCard
              title="Uploads"
              description="Track uploaded datasets by category, month, completeness %, confidence levels and validation status."
              href="/admin/uploads"
              icon={<TrendingUp className="w-6 h-6" />}
              color="amber"
              stats={`${stats.uploads} files`}
            />

            <AdminNavCard
              title="Risk Analysis"
              description="Critical gaps engine, severity levels, regulatory readiness, compliance risks and gap timelines."
              href="/admin/risk-analysis"
              icon={<AlertCircle className="w-6 h-6" />}
              color="red"
              stats="Gap detection"
            />

            <AdminNavCard
              title="Certifications"
              description="NABH, IGBC, LEED, ISO 14001 readiness scores, status badges, prerequisites and timelines."
              href="/admin/certifications"
              icon={<CheckCircle className="w-6 h-6" />}
              color="violet"
              stats={`${stats.frameworks} active`}
            />

            <AdminNavCard
              title="System Config"
              description="Benchmarks, emission factors, confidence thresholds, certification applicability and rules engine."
              href="/admin/system-config"
              icon={<Settings className="w-6 h-6" />}
              color="slate"
              stats="Master data"
            />
          </div>
        </div>

        {/* Footer Info Section */}
        <div className="mt-16 p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Mandatory Disclaimer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                SAM Assessment Application provides indicative sustainability and certification readiness intelligence. This platform does not replace official certification audits, regulatory reviews, accredited assessments, or legal compliance advice. All scores and recommendations are indicative only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'slate',
  trend,
  statusBadge,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
  statusBadge?: React.ReactNode;
}) {
  const colorClasses = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60',
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-500/60',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/30 hover:border-amber-500/60',
    violet: 'from-violet-500/10 to-violet-500/5 border-violet-500/30 hover:border-violet-500/60',
  };

  const iconColorClasses = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    violet: 'text-violet-400',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-slate-100 ${iconColorClasses[color as keyof typeof iconColorClasses]}`}>
          {icon}
        </div>
        {trend && <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">{trend}</span>}
      </div>

      <p className="text-sm text-slate-500 mb-2">{title}</p>

      <div className="flex items-end justify-between">
        <h2 className="text-4xl font-bold text-slate-900">{value}</h2>
        {statusBadge}
      </div>

      <p className="text-xs text-slate-500 mt-3">{subtitle}</p>
    </div>
  );
}

function AdminNavCard({
  title,
  description,
  href,
  icon,
  color = 'slate',
  stats,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
  stats?: string;
}) {
  const iconColorClasses = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    violet: 'text-violet-400',
    slate: 'text-slate-400',
  };

  const hoverClasses = {
    emerald: 'hover:border-emerald-500/50 group-hover:shadow-emerald-500/20',
    cyan: 'hover:border-cyan-500/50 group-hover:shadow-cyan-500/20',
    amber: 'hover:border-amber-500/50 group-hover:shadow-amber-500/20',
    red: 'hover:border-red-500/50 group-hover:shadow-red-500/20',
    violet: 'hover:border-violet-500/50 group-hover:shadow-violet-500/20',
    slate: 'hover:border-slate-500/50 group-hover:shadow-slate-500/20',
  };

  return (
    <Link
      href={href}
      className={`group bg-white rounded-2xl border border-slate-200 p-8 transition-all duration-300 hover:shadow-2xl ${hoverClasses[color as keyof typeof hoverClasses]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-slate-100 transition-colors">
          <div className={iconColorClasses[color as keyof typeof iconColorClasses]}>{icon}</div>
        </div>
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          {stats}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2 transition-colors">
        {title}
      </h3>

      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors">
        <span>Access Module</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}

function getScoreBadge(score: number) {
  if (score >= 75) {
    return <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">Strong</span>;
  } else if (score >= 60) {
    return <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-1 rounded-full">Moderate</span>;
  } else if (score >= 40) {
    return <span className="text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full">Weak</span>;
  } else {
    return <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">Critical</span>;
  }
}
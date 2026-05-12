import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            ESG Admin Dashboard
          </h1>

          <p className="text-slate-500 mt-3">
            Central intelligence hub for ESG monitoring,
            calculations, uploads, risk analysis,
            and certification readiness.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Hospitals"
            value="1"
            subtitle="Registered organizations"
          />

          <StatCard
            title="ESG Score"
            value="78%"
            subtitle="Average readiness"
          />

          <StatCard
            title="Uploads"
            value="24"
            subtitle="Operational datasets"
          />

          <StatCard
            title="Frameworks"
            value="3"
            subtitle="Mapped certifications"
          />
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <AdminNavCard
            title="Hospitals"
            description="Manage hospitals and organization data."
            href="/admin/hospitals"
          />

          <AdminNavCard
            title="Calculations"
            description="View formulas, emission factors and ESG logic."
            href="/admin/calculations"
          />

          <AdminNavCard
            title="Uploads"
            description="Track uploaded operational datasets."
            href="/admin/uploads"
          />

          <AdminNavCard
            title="Risk Analysis"
            description="Identify ESG gaps and compliance risks."
            href="/admin/risk-analysis"
          />

          <AdminNavCard
            title="Certifications"
            description="Track NABH, IGBC and ISO readiness."
            href="/admin/certifications"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-slate-900 mt-2">
        {value}
      </h2>

      <p className="text-sm text-slate-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
}

function AdminNavCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-lg transition"
    >
      <h3 className="text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-3 leading-relaxed">
        {description}
      </p>

      <div className="mt-5 text-emerald-600 font-medium">
        Open →
      </div>
    </Link>
  );
}
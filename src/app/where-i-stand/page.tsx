import TopNav from "@/components/TopNav";

export default function WhereIStandPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <TopNav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Where I Stand</h1>
        <p className="text-slate-600 mb-6">Summary of your current assessment and key metrics.</p>
        <section className="bg-white border border-slate-100 rounded-lg p-6">
          <p className="text-sm text-slate-700">This page will present the user's current standing: overall score, readiness stage and quick highlights.</p>
        </section>
      </main>
    </div>
  );
}

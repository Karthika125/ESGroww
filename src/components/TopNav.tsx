import BackButton from "@/components/BackButton";

export default function TopNav() {
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full min-w-0 max-w-none items-center gap-3 px-3 py-2.5 sm:px-5 lg:px-8 xl:px-10 2xl:px-12">
        {/* Back navigation — unobtrusive ghost button, left of logo */}
        <BackButton />

        <h1 className="text-xl font-bold tracking-tight text-emerald-600 sm:text-2xl">
          ESGroww
        </h1>
      </div>
    </header>
  );
}
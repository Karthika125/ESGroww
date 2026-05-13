import BackButton from "@/components/BackButton";

export default function TopNav() {
  return (
    <header className="shrink-0 border-b border-border bg-card">
      <div className="mx-auto flex w-full min-w-0 max-w-none items-center gap-3 px-3 py-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10">
        {/* Back navigation — unobtrusive ghost button, left of logo */}
        <BackButton />

        <h1 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
          ESGroww
        </h1>
      </div>
    </header>
  );
}
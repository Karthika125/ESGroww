import { Suspense } from "react";

import LoginForm from "./login-form";

function LoginFallback() {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col bg-slate-50">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="mx-auto h-96 max-w-lg animate-pulse rounded-2xl border border-slate-200 bg-white lg:max-w-none" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

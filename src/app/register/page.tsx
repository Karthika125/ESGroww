"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { SECTOR_OPTIONS } from "@/lib/validation";

import { COUNTRY_OPTIONS } from "@/lib/countries";

import { INDIA_STATE_OPTIONS } from "@/lib/india-states";

import {
  validateEmail,
} from "@/lib/validation";

import {
  validatePasswordStrength,
} from "@/lib/password";

import {
  BarChart3,
  Leaf,
  Sparkles,
} from "lucide-react";

const DEFAULT_COUNTRY =
  COUNTRY_OPTIONS.find(
    (c) => c.code === "IN"
  )?.name ?? "India";

function checkPasswordRules(
  password: string
) {
  return validatePasswordStrength(
    password
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",

    email: "",

    password: "",

    confirmPassword: "",

    organizationName: "",

    sectorCode: "",

    country: DEFAULT_COUNTRY,

    state: "",

    acceptTerms: false,
  });

  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>(
      {}
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const isIndia =
    form.country === "India";

  function updateField(
    key: keyof typeof form,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,

      [key]: value,

      ...(key === "country" &&
      value !== "India"
        ? {
            state: "",
          }
        : {}),
    }));

    setFieldErrors((prev) => {
      const next = {
        ...prev,
      };

      delete next[key as string];

      return next;
    });
  }

  function runClientValidation(): boolean {
    const next: Record<string, string> =
      {};

    if (
      form.fullName.trim().length < 2
    ) {
      next.fullName =
        "Enter at least 2 characters.";
    }

    if (!validateEmail(form.email)) {
      next.email =
        "Enter a valid email address.";
    }

    const pwCheck =
      checkPasswordRules(
        form.password
      );

    if (!pwCheck.valid) {
      next.password =
        "Min 8 characters, 1 uppercase, 1 number, 1 symbol.";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      next.confirmPassword =
        "Passwords must match.";
    }

    if (
      form.organizationName.trim()
        .length < 2
    ) {
      next.organizationName =
        "Enter at least 2 characters.";
    }

    if (!form.sectorCode) {
      next.sectorCode =
        "Select your industry / sector.";
    }

    if (!form.country?.trim()) {
      next.country =
        "Select a country.";
    }

    if (!form.state?.trim()) {
      next.state = isIndia
        ? "Select a state or union territory."
        : "Enter your state or region.";
    }

    if (!form.acceptTerms) {
      next.acceptTerms =
        "You must accept the terms to continue.";
    }

    setFieldErrors(next);

    return (
      Object.keys(next).length === 0
    );
  }

  async function handleRegister() {
    setError("");

    setSuccess("");

    if (!runClientValidation()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...form,

            fullName:
              form.fullName.trim(),

            email: form.email.trim(),

            organizationName:
              form.organizationName.trim(),

            country: form.country.trim(),

            state: form.state.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Registration failed"
        );

        setLoading(false);

        return;
      }

      setSuccess(data.message);

      setTimeout(() => {
        router.push("/login");
      }, 2800);
    } catch {
      setError(
        "Something went wrong."
      );
    }

    setLoading(false);
  }

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col bg-slate-50 px-4 py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <aside className="hidden lg:flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-slate-700 space-y-6 lg:sticky lg:top-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <Leaf className="w-9 h-9 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-medium">
                ESGroww
              </p>

              <h1 className="text-3xl font-semibold tracking-tight leading-tight text-slate-900">
                Create your organization profile
              </h1>
            </div>
          </div>

          <p className="text-lg text-slate-600 leading-relaxed">
            Registration locks in your{" "}
            <strong className="text-slate-800">industry / sector</strong> so benchmarks, applicable
            certifications, and governance questions match how your facility
            actually operates — from hospitals and campuses to manufacturing and
            general enterprises.
          </p>

          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex gap-3">
              <Sparkles className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />

              <span>
                After sign-up, you will receive a verification email (24-hour
                link). Until you verify, your organization stays in{" "}
                <em>Pending Verification</em> status.
              </span>
            </li>

            <li className="flex gap-3">
              <BarChart3 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />

              <span>
                One account ties your team to a single organization record — the
                foundation for every assessment and export you run in the
                platform.
              </span>
            </li>
          </ul>

          <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-6">
            SAM Assessment Application provides indicative sustainability and
            certification readiness intelligence. This platform does not replace
            official certification audits, regulatory reviews, accredited
            assessments, or legal compliance advice.
          </p>
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-md p-6 sm:p-8 md:p-10">
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <Leaf className="w-7 h-7 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Create account
              </h2>

              <p className="text-slate-600 text-sm mt-1">
                Sustainability readiness intelligence
              </p>
            </div>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Registration
            </h2>

            <p className="text-slate-600 mt-2 leading-relaxed">
              All fields marked with the flow below are required before you can
              start assessments. Already registered?{" "}
              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="text-emerald-700 font-semibold hover:text-emerald-600"
              >
                Log in
              </button>
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Full name"
              value={form.fullName}
              error={fieldErrors.fullName}
              onChange={(v) =>
                updateField(
                  "fullName",
                  v
                )
              }
            />

            <InputField
              label="Email address"
              type="email"
              autoComplete="email"
              value={form.email}
              error={fieldErrors.email}
              onChange={(v) =>
                updateField("email", v)
              }
            />

            <InputField
              label="Password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              error={fieldErrors.password}
              onChange={(v) =>
                updateField(
                  "password",
                  v
                )
              }
            />

            <InputField
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              error={
                fieldErrors.confirmPassword
              }
              onChange={(v) =>
                updateField(
                  "confirmPassword",
                  v
                )
              }
            />

            <InputField
              label="Organization name"
              value={
                form.organizationName
              }
              error={
                fieldErrors.organizationName
              }
              onChange={(v) =>
                updateField(
                  "organizationName",
                  v
                )
              }
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Industry / sector
              </label>

              <select
                value={form.sectorCode}
                onChange={(e) =>
                  updateField(
                    "sectorCode",
                    e.target.value
                  )
                }
                className={`w-full border rounded-xl px-4 py-3 bg-white text-slate-900 ${
                  fieldErrors.sectorCode
                    ? "border-red-400 ring-1 ring-red-200"
                    : "border-slate-300"
                }`}
              >
                <option value="">
                  Select sector
                </option>

                {SECTOR_OPTIONS.map(
                  (sector) => (
                    <option
                      key={sector.code}
                      value={sector.code}
                    >
                      {sector.label}
                    </option>
                  )
                )}
              </select>

              {fieldErrors.sectorCode && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.sectorCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country
              </label>

              <select
                value={form.country}
                onChange={(e) =>
                  updateField(
                    "country",
                    e.target.value
                  )
                }
                className={`w-full border rounded-xl px-4 py-3 bg-white text-slate-900 ${
                  fieldErrors.country
                    ? "border-red-400 ring-1 ring-red-200"
                    : "border-slate-300"
                }`}
              >
                {COUNTRY_OPTIONS.map(
                  (c) => (
                    <option
                      key={c.code}
                      value={c.name}
                    >
                      {c.name}
                    </option>
                  )
                )}
              </select>

              {fieldErrors.country && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.country}
                </p>
              )}
            </div>

            {isIndia ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State / union territory
                </label>

                <select
                  value={form.state}
                  onChange={(e) =>
                    updateField(
                      "state",
                      e.target.value
                    )
                  }
                  className={`w-full border rounded-xl px-4 py-3 bg-white text-slate-900 ${
                    fieldErrors.state
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-slate-300"
                  }`}
                >
                  <option value="">
                    Select state
                  </option>

                  {INDIA_STATE_OPTIONS.map(
                    (s) => (
                      <option
                        key={s}
                        value={s}
                      >
                        {s}
                      </option>
                    )
                  )}
                </select>

                {fieldErrors.state && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.state}
                  </p>
                )}
              </div>
            ) : (
              <InputField
                label="State / region"
                value={form.state}
                error={fieldErrors.state}
                onChange={(v) =>
                  updateField(
                    "state",
                    v
                  )
                }
              />
            )}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={form.acceptTerms}
                onChange={(e) =>
                  updateField(
                    "acceptTerms",
                    e.target.checked
                  )
                }
                className="mt-1 rounded border-slate-300"
              />

              <label
                htmlFor="terms"
                className="text-sm text-slate-700 leading-relaxed cursor-pointer"
              >
                I accept the{" "}
                <span className="text-emerald-800 font-medium">
                  Terms &amp; Privacy Policy
                </span>{" "}
                and understand that scores and recommendations on ESGroww are{" "}
                <strong>indicative only</strong> and do not replace certification
                audits or legal advice.
              </label>
            </div>

            {fieldErrors.acceptTerms && (
              <p className="mt-2 text-xs text-red-600 pl-7">
                {fieldErrors.acceptTerms}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-xl font-semibold transition text-base shadow-lg shadow-emerald-900/10"
          >
            {loading
              ? "Creating account…"
              : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600 lg:hidden">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-700 font-semibold hover:text-emerald-600"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) =>
          onChange(e.target.value)
        }
        aria-invalid={Boolean(error)}
        className={`w-full border rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 ${
          error
            ? "border-red-400 ring-1 ring-red-200"
            : "border-slate-300 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { SECTOR_OPTIONS } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    sectorCode: "",
    country: "India",
    state: "",
    acceptTerms: false,
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  function updateField(
    key: string,
    value: any
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleRegister() {
    try {
      setLoading(true);

      setError("");

      setSuccess("");

      const response = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
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
      }, 2500);
    } catch (error) {
      setError(
        "Something went wrong."
      );
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Create ESGroww Account
          </h1>

          <p className="text-slate-500 mt-3">
            Enterprise Sustainability Readiness Platform
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            value={form.fullName}
            onChange={(v) =>
              updateField(
                "fullName",
                v
              )
            }
          />

          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) =>
              updateField(
                "email",
                v
              )
            }
          />

          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) =>
              updateField(
                "password",
                v
              )
            }
          />

          <InputField
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(v) =>
              updateField(
                "confirmPassword",
                v
              )
            }
          />

          <InputField
            label="Organization Name"
            value={
              form.organizationName
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
              Industry / Sector
            </label>

            <select
              value={form.sectorCode}
              onChange={(e) =>
                updateField(
                  "sectorCode",
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
            >
              <option value="">
                Select Sector
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
          </div>

          <InputField
            label="Country"
            value={form.country}
            onChange={(v) =>
              updateField(
                "country",
                v
              )
            }
          />

          <InputField
            label="State / Region"
            value={form.state}
            onChange={(v) =>
              updateField(
                "state",
                v
              )
            }
          />
        </div>

        <div className="mt-6 flex items-start gap-3">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) =>
              updateField(
                "acceptTerms",
                e.target.checked
              )
            }
            className="mt-1"
          />

          <p className="text-sm text-slate-600">
            I accept Terms & Privacy Policy
          </p>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold transition"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Already have an account?{" "}
            <button
              onClick={() =>
                router.push(
                  "/login"
                )
              }
              className="text-emerald-600 hover:text-emerald-700 font-semibold transition"
            >
              Sign in
            </button>
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border border-slate-300 rounded-xl px-4 py-3"
      />
    </div>
  );
}

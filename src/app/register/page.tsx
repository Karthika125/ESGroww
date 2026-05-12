"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [hospitalName, setHospitalName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleRegister() {
    try {
      setLoading(true);

      setError("");

      const response = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            hospitalName,

            industry:
              "Healthcare",

            email,

            password,

            numberOfBeds: 500,

            builtUpArea: 10000,
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

      router.push("/login");
    } catch (error) {
      setError(
        "Something went wrong."
      );
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Register Hospital
          </h1>

          <p className="text-slate-500 mt-3">
            Create your ESGroww account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Hospital Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hospital Name
            </label>

            <input
              type="text"
              value={hospitalName}
              onChange={(e) =>
                setHospitalName(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              placeholder="Aster Medcity"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              placeholder="admin@hospital.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              placeholder="••••••••"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
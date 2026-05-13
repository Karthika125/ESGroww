"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { ArrowLeft, Leaf } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    setMessage("");

    setLoading(true);

    try {
      const res = await fetch(
        "/api/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Request failed."
        );

        setLoading(false);

        return;
      }

      setMessage(
        data.message ||
          "Check your email for next steps."
      );
    } catch {
      setError(
        "Something went wrong."
      );
    }

    setLoading(false);
  }

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-emerald-50 rounded-full border border-emerald-100">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <CardTitle className="text-2xl text-center font-bold text-slate-900">
            Reset password
          </CardTitle>

          <CardDescription className="text-center text-slate-600 leading-relaxed">
            Enter your registered email address. If an account exists, we will send
            a secure link valid for one hour.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg px-3 py-2 text-sm">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email address
              </Label>

              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@organization.com"
                className="focus-visible:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {loading
                ? "Sending…"
                : "Send reset link"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
            className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />

            Back to log in
          </button>

          <p className="text-sm text-center text-slate-500">
            Need an account?{" "}
            <Link
              href="/register"
              className="text-emerald-700 font-semibold hover:text-emerald-600"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

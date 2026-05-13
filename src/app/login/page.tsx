"use client";

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

import { useRouter } from "next/navigation";

import { Leaf } from "lucide-react";

import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
            rememberMe,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Login failed"
        );

        setLoading(false);

        return;
      }

      router.push("/upload");
    } catch (err) {
      setError(
        "Something went wrong. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-6">
      <Card className="w-full max-w-md shadow-lg border-emerald-100">
        <CardHeader className="space-y-3">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-emerald-50 rounded-full">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <CardTitle className="text-2xl text-center font-bold text-slate-900">
            Sign in to ESGroww
          </CardTitle>

          <CardDescription className="text-center text-slate-500">
            Enterprise Sustainability Readiness Platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Work Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  Password
                </Label>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/forgot-password"
                    )
                  }
                  className="text-sm text-emerald-600 hover:text-emerald-500"
                >
                  Forgot password?
                </button>
              </div>

              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
              />

              <p className="text-sm text-slate-600">
                Remember me for 30 days
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4 mt-2">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <button
              onClick={() =>
                router.push(
                  "/register"
                )
              }
              className="text-emerald-600 font-medium hover:text-emerald-700 transition"
            >
              Register
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

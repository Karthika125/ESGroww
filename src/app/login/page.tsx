"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/upload");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg border-emerald-100">
        <CardHeader className="space-y-3">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-emerald-50 rounded-full">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold text-slate-900">Sign in to ESGroww</CardTitle>
          <CardDescription className="text-center text-slate-500">
            Enterprise Sustainability Readiness Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" required className="focus-visible:ring-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-500">
                  Forgot password?
                </a>
              </div>
              <Input id="password" type="password" required className="focus-visible:ring-emerald-500" />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 mt-2">
          <p className="text-sm text-slate-500">
            Don't have an account? <a href="#" className="text-emerald-600 font-medium">Request access</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

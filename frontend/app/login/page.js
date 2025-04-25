"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/motion/motion-card";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      const session = await fetch("/api/auth/session").then((res) => res.json());

      if (session?.accessToken) {
        localStorage.setItem("accessToken", session.accessToken);
      }

      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-50 to-white px-4">
      <MotionCard>
        <div className="text-center mb-6">
          <LogIn className="mx-auto h-10 w-10 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-800 mt-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Login to manage your tasks.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full text-base">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </MotionCard>
    </div>
  );
}

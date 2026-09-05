"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import api from "@/lib/axios.js";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Update localStorage and react state
      login(user, token);

      // Redirect
      if (user.role === "RECRUITER") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold"
          >
            <Briefcase className="text-blue-500" />
            Job Portal
          </Link> */}
          <h1 className="mt-6 text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-slate-400">
            Login to continue your job search.
          </p>
        </div>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl "
        >
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-slate-300"
            >
              Email
            </label>
            <div className="flex items-center rounded-xl bg-slate-800 px-4">
              <Mail size={18} className="text-slate-500" />
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-slate-300"
            >
              Password
            </label>
            <div className="flex items-center rounded-xl bg-slate-800 px-4">
              <Lock size={18} className="text-slate-500" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register */}
          <p className="mt-5 text-center text-sm text-slate-400">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

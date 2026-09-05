"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, User, Building2, Mail, Lock } from "lucide-react";
import api from "@/lib/axios.js";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState("CANDIDATE");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    companyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (
      role === "CANDIDATE" &&
      (!formData.firstName.trim() || !formData.lastName.trim())
    ) {
      setError("First name and last name are required");
      return;
    }

    if (role === "RECRUITER" && !formData.companyName.trim()) {
      setError("Company name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: formData.email,
        password: formData.password,
        role,
      };

      if (role === "CANDIDATE") {
        payload.firstName = formData.firstName;
        payload.lastName = formData.lastName;
      }

      if (role === "RECRUITER") {
        payload.companyName = formData.companyName;
      }

      await api.post("/auth/register", payload);
      router.push("/login");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Registration failed. Please try again",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold"
          >
            <Briefcase className="text-blue-500" />
            JobPortal
          </Link>

          <h1 className="mt-6 text-3xl font-bold">Create your account</h1>

          <p className="mt-2 text-slate-400">Start your journey today.</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 p-6 shadow-xl"
        >
          {/* Role Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium">
              I want to register as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("CANDIDATE")}
                className={`rounded-xl border p-4 transition ${role === "CANDIDATE" ? "border-blue-500 bg-500/10" : "border-slate-700 hover:border-slate-600"}`}
              >
                <User className="mx-auto mb-2 text-blue-500" />
                <span className="text-sm font-medium">Candidate</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("RECRUITER")}
                className={`rounded-xl border p-4 transition ${role === "RECRUITER" ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-600"}`}
              >
                <Building2 className="mx-auto mb-2 text-blue-500" />
                <span className="text-sm font-medium">Recruiter</span>
              </button>
            </div>
          </div>

          {/* Candidate Fields */}
          {role === "CANDIDATE" && (
            <div className="mb-4 grid grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="rounded-xl bg-slate-800 px-4 py-3 outline-none ring-blue-500 focus:ring-2"
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="rounded-xl bg-slate-800 px-4 py-3 outline-none ring-blue-500 focus:ring-2"
              />
            </div>
          )}

          {/* Recruiter fields */}
          {role === "RECRUITER" && (
            <div className="mb-4">
              <div className="flex items-center rounded-xl bg-slate-800 px-4">
                <Building2 size={18} className="text-slate-500" />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4 flex items-center rounded-xl bg-slate-800 px-4">
            <Mail size={18} className="text-slate-500" />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-3 outline-none"
            />
          </div>
          {/* Password */}
          <div className="mb-4 flex items-center rounded-xl bg-slate-800 px-4">
            <Lock size={18} className="text-slate-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-3 outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-no-allowed disabled:opacity-50"
          >
            {loading ? "Creating account" : "Create Account"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

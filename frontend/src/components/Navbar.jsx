"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Briefcase className="text-blue-500" />
          JobPortal
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/jobs"
            className="text-slate-300 transition hover:text-white"
          >
            Find Jobs
          </Link>

          <Link
            href="/login"
            className="text-slate-300 transition hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

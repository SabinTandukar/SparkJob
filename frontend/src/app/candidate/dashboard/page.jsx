"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle,
  Clock,
  UserRound,
  ArrowRight,
  FileText,
} from "lucide-react";
import api from "@/lib/axios.js";
import { useAuth } from "@/context/AuthContext";
import DashboardCard from "@/components/DashboardCard";

export default function CandiateDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await api.get("/candidates/statistics");

        console.log("Dashboard response", response.data);

        setDashboard(response.data);
      } catch (error) {
        console.error(
          "Failed to load candidate dashboard: ",
          error?.response.data || error,
        );
        setError(error.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h2 className="text-lg font-semibold text-red-400">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-slate-300">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const statistics = dashboard?.statistics || {};

  const recentApplications = dashboard?.recentApplications || [];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-blue-500">Candidate dashboard</p>
          <h1 className="mt-2 text-4xl font-bold">
            Welcome back, {dashboard?.candidate?.firstName || "Candidate"}
          </h1>
          <p className="mt-3 text-slate-400">
            Track your applications and manage your professional profile.
          </p>
        </div>
        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-3">
          <DashboardCard
            title="Applications"
            value={statistics?.totalApplications || 0}
            description="Job you have applied for"
            icon={<Briefcase size={21} />}
          />

          <DashboardCard
            title="Shortlisted"
            value={statistics?.shortlisted || 0}
            description="Applications shortlisted"
            icon={<CheckCircle size={21} />}
          />

          <DashboardCard
            title="Interviews"
            value={statistics?.interviews || 0}
            description="Upcoming interview stages"
            icon={<Clock size={21} />}
          />
        </div>

        {/* Profile Completeness */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Profile Completeness</h2>
              <p className="mt-1 text-sm text-slate-400">
                Complete your profile to improve your chances of getting hired.
              </p>
            </div>
            <UserRound className="text-blue-500" />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Profile Progress</span>

              <span className="font-medium">
                {statistics?.profileCompleteness || 0}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${statistics?.profileCompleteness || 0}%` }}
              />
            </div>
          </div>

          <Link
            href="/candidate/profile"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-400"
          >
            Complete Profile
            <ArrowRight size={16} />
          </Link>
        </section>

        {/* Recent applications */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recent Applications</h2>
              <p className="mt-1 text-sm text-slate-400">
                Track the progress of your recent applications.
              </p>
            </div>
            <Link
              href="/candidate/applications"
              className="hidden items-center gap-2 text-sm text-blue-500 hover:text-blue-400 sm:flex"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            {recentApplications.length === 0 ? (
              <div className="p-10 text-center">
                <FileText className="mx-auto text-slate-600" size={40} />
                <h3 className="mt-4 text-lg font-semibold">
                  No applications yet
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Start applying for jobs to see them here.
                </p>
                <Link
                  href="/jobs"
                  className="mt-5 inline-block rounded-lg.bg-blue-600.px-5.py-2.5.text-sm.font-medium.hover:bg-blue-500"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              recentApplications
                .slice(0, 5)
                .map((application) => (
                  <ApplicationRow
                    key={application.id}
                    application={application}
                  />
                ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ApplicationRow({ application }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-semibold">{application.job?.title || "Job"}</h3>
        <p className="mt-1 text-sm text-slate-400">
          {application.job?.location || "Location unavailable"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Applied{" "}
          {application.createdAt
            ? new Date(application.createdAt).toLocaleDateString()
            : ""}
        </p>
      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
          application.status === "HIRED"
            ? "bg-green-500/10 text-green-400"
            : application.status === "REJECTED"
              ? "bg-red-500/10 text-red-400"
              : application.status === "SHORTLISTED"
                ? "bg-blue-500/10 text-blue-400"
                : application.status === "INTERVIEW"
                  ? "bg-purple-500/10 text-purple-400"
                  : "bg-yellow-500/10 text-yellow-400"
        }`}
      >
        {application.status}
      </span>
    </div>
  );
}

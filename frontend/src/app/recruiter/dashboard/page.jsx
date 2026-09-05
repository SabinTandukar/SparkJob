"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Briefcase,
  CheckCircle,
  Users,
  FileText,
  ArrowRight,
  Plus,
} from "lucide-react";

import api from "@/lib/axios.js";

import DashboardCard from "@/components/DashboardCard";

export default function RecruiterDashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await api.get("/recruiter/statistics");

        console.log("Recruiter Dashboard:", response.data);

        setDashboard(response.data);
      } catch (error) {
        console.error(
          "Failed to load recruiter dashboard:",
          error?.response?.data || error,
        );

        setError(
          error?.response?.data?.error || "Failed to load recruiter dashboard",
        );
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

        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-blue-500">Recruiter Dashboard</p>

            <h1 className="mt-2 text-4xl font-bold">
              Welcome back, {dashboard?.recruiter?.companyName || "Recruiter"}
            </h1>

            <p className="mt-3 text-slate-400">
              Manage your jobs and track candidate applications.
            </p>
          </div>

          <Link
            href="/recruiter/jobs/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
          >
            <Plus size={18} />
            Post a Job
          </Link>
        </div>

        {/* Statistics */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Jobs"
            value={statistics.totalJobs || 0}
            description="Jobs you have posted"
            icon={<Briefcase size={21} />}
          />

          <DashboardCard
            title="Open Jobs"
            value={statistics.openJobs || 0}
            description="Currently accepting applications"
            icon={<CheckCircle size={21} />}
          />

          <DashboardCard
            title="Closed jobs"
            value={statistics.closedJobs || 0}
            description="Total candidate applications"
            icon={<FileText size={21} />}
          />

          <DashboardCard
            title="Applications"
            value={statistics.totalApplications || 0}
            description="Total candidate applications"
            icon={<FileText size={21} />}
          />

          <DashboardCard
            title="Hired"
            value={statistics.hired || 0}
            description="Candidates successfully hired"
            icon={<Users size={21} />}
          />
        </div>

        {/* Quick Actions */}

        <section className="mt-8">
          <h2 className="text-2xl font-bold">Quick Actions</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Link
              href="/recruiter/jobs/create"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
            >
              <Plus className="text-blue-500" />

              <h3 className="mt-4 font-semibold">Post a New Job</h3>

              <p className="mt-2 text-sm text-slate-400">
                Create a new job listing and start receiving applications.
              </p>
            </Link>

            <Link
              href="/recruiter/jobs"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
            >
              <Briefcase className="text-blue-500" />

              <h3 className="mt-4 font-semibold">Manage Jobs</h3>

              <p className="mt-2 text-sm text-slate-400">
                Edit, close, or review your existing job listings.
              </p>
            </Link>

            <Link
              href="/recruiter/applications"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
            >
              <Users className="text-blue-500" />

              <h3 className="mt-4 font-semibold">Review Candidates</h3>

              <p className="mt-2 text-sm text-slate-400">
                Review applications and manage candidate status.
              </p>
            </Link>
          </div>
        </section>

        {/* Recent Applications */}

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recent Applications</h2>

              <p className="mt-1 text-sm text-slate-400">
                Latest candidates who applied to your jobs.
              </p>
            </div>

            <Link
              href="/recruiter/applications"
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
                  Applications from candidates will appear here.
                </p>
              </div>
            ) : (
              recentApplications.map((application) => (
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
  const candidateName =
    `${application.candidate?.firstName || ""} ${
      application.candidate?.lastName || ""
    }`.trim() || "Candidate";

  return (
    <div className="flex flex-col gap-4 border-b border-slate-800 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-semibold">{candidateName}</h3>

        <p className="mt-1 text-sm text-slate-400">
          Applied for {application.job?.title || "Job"}
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

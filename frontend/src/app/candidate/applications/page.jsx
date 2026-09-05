"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Briefcase,
  MapPin,
  Calender,
  ArrowRight,
  ChevronRight,
  ChevronLight,
  FileText,
  ChevronLeft,
  Calendar,
} from "lucide-react";

import api from "@/lib/axios.js";
import { div } from "framer-motion/client";

const STATUS_OPTIONS = [
  "ALL",
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "HIRED",
  "REJECTED",
];

export default function CandidateApplicationPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
  });

  const fetchApplications = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", 10);

      params.append("sortBy", "createdAt");
      params.append("order", sortOrder);

      if (status !== "ALL") {
        params.append("status", status);
      }

      const response = await api.get(
        `/applications/my-applications?${params.toString()}`,
      );

      setApplications(response.data.applications || []);

      setPagination(response.data.pagination);
    } catch (error) {
      console.error(
        "Failed to fetch applications:",
        error.response?.data || error,
      );

      setError(error.response?.data?.error || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  //   Fetch applications when filtering change
  useEffect(() => {
    fetchApplications(1);
  }, [status, sortOrder]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) {
      return;
    }

    fetchApplications(newPage);
  };

  if (loading && applications.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-400">Loading applications</p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-blue-500">Candidate</p>
          <h1 className="mt-2 text-4xl font-bold">My Applications</h1>
          <p className="mt-3 text-slate-400">
            Track and manage all your applications.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-center md:justify-between">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((item) => (
              <button
                key={item}
                onClick={() => handleStatusChange(item)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${status === item ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
              >
                {item === "ALL"
                  ? "ALL"
                  : item.charAt(0) + item.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm outline-none"
          >
            <option value="desc">Newest First</option>

            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Applications */}
        {applications.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <FileText size={48} className="mx-auto text-slate-600" />
            <h2 className="mt-5 text-xl font-semibold">
              No applications found
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="rounded-lg border border-slate-700 p-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="text-sm text-slate-400">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="rounded-lg border border-slate-700 p-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function ApplicationCard({ application }) {
  const job = application.job;

  const getStatusStyle = (status) => {
    const styles = {
      APPLIED: "bg-yellow-500/10 text-yellow-400",
      REVIEWING: "bg-blue-500/10 text-blue-400",
      SHORTLISTED: "bg-cyan-500/10 text-cyan-400",
      INTERVIEW: "bg-purple-500/10 text-purple-400",
      HIRED: "bg-green-500/10 text-green-400",
      REJECTED: "bg-red-500/10 text-red-400",
    };

    return styles[status] || "bg-slate-500/10 text-slate-400";
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        {/* Job information */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Briefcase size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                {job?.title || "Job Title"}
              </h2>
              <p className="text-sm text-slate-400">
                {job?.recruiter?.companyName || "Company"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={16} />

              {job?.location || "Location unavailable"}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Applied{" "}
              {application.createdAt
                ? new Date(application.createdAt).toLocaleDateString()
                : ""}
            </div>
          </div>
        </div>

        {/* Status and action */}
        <div className="flex items-center gap-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(application.status)}`}
          >
            {application.status}
          </span>

          {job?.id && (
            <Link
              href={`/jobs/${job.id}`}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
            >
              View Job
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

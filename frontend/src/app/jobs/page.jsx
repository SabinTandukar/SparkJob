"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "@/lib/axios.js";
import JobCard from "@/components/JobCard";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [employeeType, setEmployeeType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (keyword.trim()) {
        params.append("keyword", keyword.trim());
      }

      if (location.trim()) {
        params.append("location", location.trim());
      }

      if (employeeType) {
        params.append("employeeType", employeeType);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/search?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      setJobs(data.jobs || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Find your next job</h1>
          <p className="mt-3 text-slate-400">
            Search through available opportunities
          </p>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="mb-10 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-4"
        >
          <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4">
            <Search size={18} className="text-slate-500" />

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="keyword"
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="rounded-xl bg-slate-800 px-4 py-3 outline-none"
          />

          <select
            value={employeeType}
            onChange={(e) => setEmployeeType(e.target.value)}
            className="rounded-xl bg-slate-800 px-4 py-3 outline-none"
          >
            <option value="">All types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="FREELANCE">Freelance</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
          >
            Search
          </button>
        </form>

        {/* Results */}
        {loading && <p className="text-slate-400">Loading Jobs...</p>}

        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold">No jobs found</h2>

            <p className="mt-2 text-slate-400">
              Try changing you search filters.
            </p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Building2,
} from "lucide-react";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch job");
      }

      const data = await response.json();

      //   Your backend may return the job directly
      // or inside {job: ...}
      setJob(data.job || data);
    } catch (error) {
      console.error(error);
      setError("Unable to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchJob();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-400">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to jobs
          </button>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h1 className="text-2xl font-semibold">Job not found</h1>

            <p className="mt-3 text-slate-400">
              The job you are looking for may no longer be available
            </p>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center text-slate-400 transition hover:text-white cursor-pointer"
        >
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <div className="grid grid-6 lg:grid-cols-3 gap-8">
          {/* Main job information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              {/* Job Header */}
              <div className="border-b border-slate-800 pb-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
                  <Briefcase size={28} />
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">{job.title}</h1>

                {job.recruiter?.companyName && (
                  <div className="mt-4 flex items-center gap-2 text-slate-400">
                    <Building2 size={18} />
                    {job.recruiter.companyName}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
                  {job.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={17} />
                      {job.location}
                    </div>
                  )}

                  {job.employeeType && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={17} />
                      {job.employeeType}
                    </div>
                  )}

                  {(job.salaryMin || job.salaryMax) && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={17} />
                      {job.salaryMin ?? "N/A"} - {job.salaryMax ?? "N/A"}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="border-b border-slate-800 py-8">
                <h2 className="text-xl font-semibold">Job Description</h2>
                <p className="mt-4 whitespace-pre-line leading-0 text-slate-400">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="border-b border-slate-800 py-8">
                  <h2 className="text-xl font-semibold">Requirements</h2>
                  <p className="mt-4 whitespace-pre-line leading-8 text-slate-400">
                    {job.requirements}
                  </p>
                </div>
              )}

              {/* Skills */}
              {job.skills && (
                <div className="py-8">
                  <h2 className="text-xl font-semibold">Skills</h2>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {Array.isArray(job.skills) ? (
                      job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300">
                        {job.skills}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Apply for this job</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Submit your application and let the recruiter know why you are a
                good fit for this position.
              </p>

              {job.deadline && (
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-800 p-4">
                  <Calendar size={20} className="text-blue-500" />

                  <div>
                    <p className="text-sm text-slate-500">
                      Application deadline
                    </p>
                    <p>{new Date(job.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push(`/jobs/${job.id}/apply`)}
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
              >
                Apply Now
              </button>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}

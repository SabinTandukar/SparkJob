"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, MapPin, Send, CheckCircle } from "lucide-react";

import api from "@/lib/axios.js";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params?.id;

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  //   Fetch job
  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data.job || response.data);
    } catch (error) {
      console.error("Application error:", error);

      console.log("Backend response: ", error.response?.data);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to submit application",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  //   Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedCoverLetter = String(coverLetter || "").trim();

    if (!trimmedCoverLetter) {
      setError("Please write a cover letter");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post(`/applications/${jobId}`, {
        coverLetter: trimmedCoverLetter,
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.error || "Unable to submit application.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  //   Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-400">Loading job...</p>
        </div>
      </main>
    );
  }

  //   Job error
  if (error && !job) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h1 className="text-2xl font-semibold">{error}</h1>
          </div>
        </div>
      </main>
    );
  }

  //   Successful application
  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px=6 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
            <CheckCircle size={34} />
          </div>

          <h1 className="mt-6 text-3xl font-bold">Application submitted</h1>
          <p className="mt-4 leading-7 text-slate-400">
            Your application for
            <span className="font-medium text-white">{job.title}</span>
            has been submitted successfully.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/applications")}
              className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
            >
              View Applications
            </button>

            <button
              onClick={() => router.push("/jobs")}
              className="flex-1 rounded-xl border border-slate-700 px-5 py-3 font-medium hover:bg-slate-800"
            >
              Browse Jobs
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to job
        </button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Job summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-800 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
                <Briefcase size={24} />
              </div>
              <h1 className="mt-5 text-2xl font-bold">{job.title}</h1>

              {job.recruiter?.companyName && (
                <p className="mt-2 text-slate-400">
                  {job.recruiter.companyName}
                </p>
              )}

              {job.location && (
                <div className="mt-6 flex items-center gap-2 text-sm text-slate">
                  <MapPin size={17} />
                  {job.location}
                </div>
              )}

              {job.employeeType && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                  <Briefcase size={17} />
                  {job.employeeType}
                </div>
              )}

              <div className="mt-6 border-t border-slate-800 pt-6">
                <p className="text-sm text-slate-500">You are applying for</p>
                <p className="mt-1 font-medium">{job.title}</p>
              </div>
            </div>
          </motion.div>

          {/* Application form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Apply for this position</h2>
                <p className="mt-2 text-slate-400">
                  Tell the recruiter why you are a good fit for this position.
                </p>
              </div>
              {error && (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="coverLetter"
                    className="mb-2 block text-sm font-medium"
                  >
                    Cover Letter
                  </label>

                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => {
                      setCoverLetter(e.target.value);
                      setError("");
                    }}
                    placeholder="Introduce youself and explain why you are a good fit for this position..."
                    rows={12}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 leading-7 outline-none transition focus:border-blue-500"
                  />

                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>Write a clear and professional cover letter.</span>

                    <span>{coverLetter.length} characters</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-xl border border-slate-700 px-6 py-3 font-medium transition hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />

                    {submitting ? "Submitting..." : "Sumbmit Application"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

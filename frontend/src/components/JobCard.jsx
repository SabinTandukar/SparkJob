"use client";

import Link from "next/link";
import { MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function JobCard({ job }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semi">{job.title}</h2>
          <p className="mt-1 text-sm text-blue-400">
            {job.recruiter?.companyName}
          </p>
        </div>

        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
          {job.employeeType}
        </span>
      </div>

      <div className="space-y-3 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin size={17} />
          {job.location || "Remote"}
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={17} />
          {job.employeeType}
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
        {job.description}
      </p>

      <Link
        href={`/jobs/${job.id}`}
        className="mt-6 block rounded-xl border border-slate-700 px-4 py-3 text-center font-medium transition hover:bg-slate-800"
      >
        View Job
      </Link>
    </motion.div>
  );
}

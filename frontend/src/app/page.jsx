"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Briefcase, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const searchKeyword = keyword.trim();

    // Don't search if input is empty
    if (!searchKeyword) {
      return;
    }

    router.push(`/jobs?keyword=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="mb-6 inline-block rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
              Find your next opportunity
            </span>

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Find a job you{" "}
              <span className="text-blue-500">actually want.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Discover opportunities, build your professional profile, and
              connect with companies looking for talented people.
            </p>
          </motion.div>

          {/* Job Title Search */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-10 max-w-4xl"
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 md:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">
                <Search className="text-slate-400" size={26} />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search By Job Title"
                  className="w-full bg-transparent outline-none placeholder:text-slate-500"
                  required
                />

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 "
                >
                  <p className="text-sm">Search </p> <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-900">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-3">
          <Feature
            icon={<Search />}
            title="Find Jobs"
            description="Search and filter jobs based on your skills, location and employment type"
          />

          <Feature
            icon={<Briefcase />}
            title="Build Your Profile"
            description="Showcase your education, experience, projects, certifications, and skills."
          />

          <Feature
            icon={<Users />}
            title="Connect With Recruiters"
            description="Apply for jobs and track you applications throughout the hiring process"
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
        {icon}
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </motion.div>
  );
}

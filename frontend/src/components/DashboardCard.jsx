"use client";

export default function DashboardCard({ title, value, description, icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{value}</h2>

          {description && (
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

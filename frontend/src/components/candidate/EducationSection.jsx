"use client";

import { useState } from "react";
import { GraduationCap, Plus, Pencil, Trash2, Save } from "lucide-react";

import api from "@/lib/axios.js";
import ProfileModal from "./ProfileModal";

export default function EducationSection({ education = [], refreshProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  //   Open Add Modal
  const openAddModal = () => {
    setEditingEducation(null);

    setFormData({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    setIsModalOpen(true);
  };

  //   Open Edit Modal
  const openEditModal = (item) => {
    setEditingEducation(item);

    setFormData({
      institution: item.institution || "",
      degree: item.degree || "",
      field: item.field || "",

      startDate: item.startDate ? item.startDate.split("T")[0] : "",

      endDate: item.endDate ? item.endDate.split("T")[0] : "",

      description: item.description || "",
    });

    setIsModalOpen(true);
  };

  //   Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  //   Create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingEducation) {
        await api.put(`/candidates/education/${editingEducation.id}`, formData);
      } else {
        await api.post("/candidates/education", formData);
      }

      setIsModalOpen(false);

      await refreshProfile();
    } catch (error) {
      console.error("Failed to save education:", error.response?.data || error);

      alert(error.response?.data?.error || "Failed to save education");
    } finally {
      setLoading(false);
    }
  };

  //   Delete education
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/candidates/education/${id}`);
      await refreshProfile();
    } catch (error) {
      console.error(
        "Failed to delete education:",
        error.response?.data || error,
      );

      alert(error.response?.data?.error || "Failed to delete education");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
            <GraduationCap size={21} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Education</h2>
            <p className="mt-1 text-sm text-slate-400">
              Add your educational background.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
        >
          <Plus size={17} />
          Add Education
        </button>
      </div>

      {/* Education list */}
      {education.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center">
          <GraduationCap className="mx-auto text-slate-600" size={35} />
          <p className="mt-3 text-sm text-slate-400">No education added yet</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {education.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 rounded-xl border-slate-800 bg-slate-800/40 p-5 md:flex-row"
            >
              <div>
                <h3 className="font-semibold">{item.degree}</h3>
                <p className="mt-1 text-sm text-blue-400">{item.institution}</p>

                {item.field && (
                  <p className="mt-2 text-sm text-slate-400">{item.field}</p>
                )}

                <p className="mt-2 text-xs text-slate-500">
                  {item.startDate ? new Date(item.startDate).getFullYear() : ""}

                  {" - "}

                  {item.endDate
                    ? new Date(item.endDate).getFullYear()
                    : "Present"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10"
                >
                  <Pencil size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ProfileModal
          title={editingEducation ? "Edit Education" : "Add Education"}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <ProfileInput
              label="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
            />

            <ProfileInput
              label="Degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
            />

            <ProfileInput
              label="Field of study"
              name="field"
              value={formData.field}
              onChange={handleChange}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <ProfileInput
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
              <ProfileInput
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 disabled:opacity-60"
            >
              <Save size={18} />
              {loading
                ? "Saving..."
                : editingEducation
                  ? "Update Education"
                  : "Add Education"}
            </button>
          </form>
        </ProfileModal>
      )}
    </section>
  );
}

function ProfileInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
  );
}

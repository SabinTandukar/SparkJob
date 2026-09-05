"use client";

import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  Save,
  Plus,
  X,
} from "lucide-react";
import EducationSection from "@/components/candidate/EducationSection";

import api from "@/lib/axios.js";

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    headline: "",
    bio: "",
    skills: [],
    resumeUrl: "",
  });

  const [skillInput, setSkillInput] = useState("");

  //   Fetch candidate profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/candidates/profile");

      const candidateProfile = response.data.profile;

      setProfile(candidateProfile);

      setFormData({
        firstName: candidateProfile.firstName || "",
        lastName: candidateProfile.lastName || "",
        phone: candidateProfile.phone || "",
        location: candidateProfile.location || "",
        headline: candidateProfile.headline || "",
        bio: candidateProfile.bio || "",
        skills: Array.isArray(candidateProfile.skills)
          ? candidateProfile.skills
          : [],
        resumeUrl: candidateProfile.resumeUrl || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);

      setError(
        error.response?.data?.error || "Failed to load candidate profile",
      );
    } finally {
      setLoading(false);
    }
  };

  //   Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  //   Add skill
  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    // Make sure skills is alwarys an array
    const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];

    // Prevent duplicate skills
    if (currentSkills.includes(skill)) {
      setSkillInput("");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      skills: [
        ...(Array.isArray(previous.skills) ? previous.skills : []),
        skill,
      ],
    }));

    setSkillInput("");
  };

  //   Remove skill
  const removeSkill = (skill) => {
    setFormData((previous) => ({
      ...previous,
      skills: (Array.isArray(previous.skills) ? previous.skills : []).filter(
        (item) => item !== skill,
      ),
    }));
  };

  //   Save Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put("/candidates/profile", formData);

      setProfile(response.data.profile);

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile", error);

      setError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-blue-500">Candidate Profile</p>
          <h1 className="mt-2 text-4xl font-bold">Manager Your Profile</h1>

          <p className="mt-3 text-slate-400">
            Keep your profile updated to improve your change of getting hired.
          </p>
        </div>

        {/* Success message */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <SectionTitle
              icon={<User size={20} />}
              description="Tell recruiters about yourself"
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Kathmandu, Nepal"
              />
            </div>
          </section>
          {/* Professional Information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <SectionTitle
              icon={<Briefcase size={20} />}
              title="Professional Information"
              description="Tell recruiters about your professional background"
            />

            <div className="mt-6 space-y-5">
              <Input
                label="Professional Headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Example: Full Stack Developer"
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  About You
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell recruiters about yourself..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>
            </div>
          </section>
          {/* Skills */}{" "}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            {" "}
            <SectionTitle
              icon={<Code2 size={20} />}
              title="Skills"
              description="Add your professional and technical skills."
            />{" "}
            <div className="mt-6 flex gap-3">
              {" "}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Example: React.js"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              />{" "}
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
              >
                {" "}
                <Plus size={18} /> Add{" "}
              </button>{" "}
            </div>{" "}
            <div className="mt-5 flex flex-wrap gap-3">
              {" "}
              {(Array.isArray(formData.skills) ? formData.skills : []).map(
                (skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400"
                  >
                    {" "}
                    {skill}{" "}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      {" "}
                      <X size={15} />{" "}
                    </button>{" "}
                  </div>
                ),
              )}{" "}
            </div>{" "}
          </section>
          
          {/* Education */}{" "}
          <EducationSection
            education={profile?.education || []}
            refreshProfile={fetchProfile}
          />
          {/* Experience */}{" "}
          <ProfileSection
            icon={<Briefcase size={20} />}
            title="Work Experience"
            description="Show your professional experience."
            items={profile?.experiences}
            emptyText="No work experience added yet."
          />{" "}
          {/* Projects */}{" "}
          <ProfileSection
            icon={<Code2 size={20} />}
            title="Projects"
            description="Showcase your best projects."
            items={profile?.projects}
            emptyText="No projects added yet."
          />{" "}
          {/* Certifications */}{" "}
          <ProfileSection
            icon={<Award size={20} />}
            title="Certifications"
            description="Add your professional certifications."
            items={profile?.certifications}
            emptyText="No certifications added yet."
          />{" "}
          {/* Save Button */}{" "}
          <div className="flex justify-end">
            {" "}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {" "}
              <Save size={18} /> {saving ? "Saving..." : "Save Profile"}{" "}
            </button>{" "}
          </div>
        </form>
      </div>
    </main>
  );
}

/* Section Title */

function SectionTitle({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">{icon}</div>

      <div>
        <h2 className="text-xl font-semibold">{title}</h2>

        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

/* Input Component */

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500"
      />
    </div>
  );
}

/* Profile Section */

function ProfileSection({ icon, title, description, items, emptyText }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <SectionTitle icon={icon} title={title} description={description} />

      {!items || items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-6 text-center">
          <p className="text-sm text-slate-400">{emptyText}</p>

          <button
            type="button"
            className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-400"
          >
            + Add {title}
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-800/50 p-4"
            >
              <p className="font-medium">
                {item.title ||
                  item.degree ||
                  item.name ||
                  item.institution ||
                  "Profile Item"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

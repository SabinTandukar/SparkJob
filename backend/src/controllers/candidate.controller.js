import { prisma } from "../lib/prisma.js";

export const getCandidateProfile = async (req, res) => {
  try {
    // Find the candidate profile belonging to the logged-in user
    const profile = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        experiences: true,
        education: true,
        projects: true,
        certifications: true,
      },
    });

    // if the profile doesn't exist
    if (!profile) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // send the profile back to the client
    return res.status(200).json({ profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// update candidate profile
export const updateCandidateProfile = async (req, res) => {
  try {
    // get the filed that the candidate wants to update
    const {
      firstName,
      lastName,
      phone,
      location,
      headline,
      bio,
      skills,
      resumeUrl,
    } = req.body;

    // find the candidate profile
    const existingProfile = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });
    // Make sure candidate profile exists
    if (!existingProfile) {
      return res
        .status(404)
        .json({ error: "Candidate profile does not exist" });
    }

    // build the update object
    const updateData = Object.fromEntries(
      Object.entries({
        firstName,
        lastName,
        phone,
        location,
        headline,
        bio,
        skills,
        resumeUrl,
      }).filter(([, value]) => value !== undefined),
    );

    // Update candidate profile
    const updateProfile = await prisma.candidateProfile.update({
      where: {
        userId: req.user.id,
      },
      data: updateData,
    });

    // Send the updated profile back
    return res.status(200).json({
      message: "Candidate profile updated successfully.",
      profile: updateProfile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// candidate dashboard statistics
export const getCandidateStats = async (req, res) => {
  try {
    // get candidate profile
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if candidate exists
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // get totalApplications
    const totalApplications = await prisma.jobApplication.count({
      where: {
        candidateId: candidate.id,
      },
    });

    // reviewing
    const reviewing = await prisma.jobApplication.count({
      where: {
        candidateId: candidate.id,
        status: "REVIEWING",
      },
    });

    // shortlisted
    const shortlisted = await prisma.jobApplication.count({
      where: {
        candidateId: candidate.id,
        status: "SHORTLISTED",
      },
    });

    // interviews
    const interviews = await prisma.jobApplication.count({
      where: {
        candidateId: candidate.id,
        status: "INTERVIEW",
      },
    });

    // hired
    const hired = await prisma.jobApplication.count({
      where: {
        candidateId: candidate.id,
        status: "HIRED",
      },
    });

    // rejected
    const rejected = await prisma.jobApplication.count({
      where: {
        candidateId: candidate.id,
        status: "REJECTED",
      },
    });

    // return
    return res.status(200).json({
      statistics: {
        totalApplications,
        reviewing,
        shortlisted,
        interviews,
        hired,
        rejected,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// get candidate profile completeness
export const getProfileCompleteness = async (req, res) => {
  try {
    // find candidate profile
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        education: true,
        experiences: true,
        projects: true,
        certifications: true,
      },
    });

    // check candidate exists
    if (!candidate) {
      return res.status(404).json({
        error: "Candidate profile not found",
      });
    }

    // Check completed sections
    const sections = {
      firstName: Boolean(candidate.firstName?.trim()),
      lastName: Boolean(candidate.lastName?.trim()),
      education: candidate.education.length > 0,
      experience: candidate.experiences.length > 0,
      projects: candidate.projects.length > 0,
      certifications: candidate.certifications.length > 0,
    };

    // calculate completed sections
    const completedSections = Object.values(sections).filter(Boolean).length;

    // Total sections
    const totalSections = Object.keys(sections).length;

    // Calculate percentage
    const completeness = Math.round((completedSections / totalSections) * 100);

    // return
    return res.status(200).json({
      completeness,
      completedSections,
      totalSections,
      sections,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

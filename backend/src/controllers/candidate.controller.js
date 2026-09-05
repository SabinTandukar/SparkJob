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
    // Find candidate profile related with profile information
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

    // Check if candidate exists
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // get application statistics
    const [
      totalApplications,
      reviewing,
      shortlisted,
      interviews,
      hired,
      rejected,
    ] = await Promise.all([
      prisma.jobApplication.count({
        where: {
          candidateId: candidate.id,
        },
      }),

      prisma.jobApplication.count({
        where: {
          candidateId: candidate.id,
          status: "REVIEWING",
        },
      }),

      prisma.jobApplication.count({
        where: {
          candidateId: candidate.id,
          status: "SHORTLISTED",
        },
      }),

      prisma.jobApplication.count({
        where: {
          candidateId: candidate.id,
          status: "INTERVIEW",
        },
      }),

      prisma.jobApplication.count({
        where: {
          candidateId: candidate.id,
          status: "HIRED",
        },
      }),

      prisma.jobApplication.count({
        where: {
          candidateId: candidate.id,
          status: "REJECTED",
        },
      }),
    ]);

    // Get recent applications
    const recentApplications = await prisma.jobApplication.findMany({
      where: {
        candidateId: candidate.id,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            employeeType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },

      take: 5,
    });

    // Profile completeness sections
    const sections = {
      firstName: Boolean(candidate.firstName?.trim()),
      lastName: Boolean(candidate.lastName?.trim()),
      phone: Boolean(candidate.phone?.trim()),
      location: Boolean(candidate.location?.trim()),
      headline: Boolean(candidate.headline?.trim()),
      bio: Boolean(candidate.bio?.trim()),
      skills: Array.isArray(candidate.skills)
        ? candidate.skills.length > 0
        : Boolean(candidate.skills?.trim()),
      education: candidate.education.length > 0,
      experience: candidate.experiences.length > 0,
      projects: candidate.projects.length > 0,
      certifications: candidate.certifications.length > 0,
      resume: Boolean(candidate.resumeUrl?.trim()),
    };

    // Calculate profile completeness
    const completedSections = Object.values(sections).filter(Boolean).length;

    const totalSections = Object.keys(sections).length;

    const profileCompleteness =
      Math.round(completedSections / totalSections) * 100;

    // Return dashboard data
    return res.status(200).json({
      candidate: {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
      },
      statistics: {
        totalApplications,
        reviewing,
        shortlisted,
        interviews,
        hired,
        rejected,
        profileCompleteness,
      },
      recentApplications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

import { prisma } from "../lib/prisma.js";

export const getCandidateProfile = async (req, res) => {
  try {
    // Find the candidate profile belonging to the logged-in user
    const profile = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
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
    const { firstName, lastName, phone, location, headline, bio, resumeUrl } =
      req.body;

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
        resumeUrl,
      }).filter(([__dirname, value]) => value !== undefined),
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

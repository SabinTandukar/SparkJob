import { prisma } from "../lib/prisma.js";

export const createEducation = async (req, res) => {
  try {
    //Get education information form the request
    const { institution, degree, field, startDate, endDate, description } =
      req.body;

    // validate required field
    if (!institution) {
      return res.status(400).json({ error: "Institution is required" });
    }

    // find the candidate profile belonging to the logged in user
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Create education record
    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        field,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    });

    return res
      .status(200)
      .json({ message: "Education added successfully", education });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

// Get all education records
export const getEducation = async (req, res) => {
  try {
    // Find candidate profile
    const candidate = await prisma.education.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!candidate) {
      return res.status(404).json({
        error: "Candidate profile not found",
      });
    }

    // Get all education records belonging to this candidate
    const education = await prisma.education.findMany({
      where: {
        candidateId: candidate.id,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return res.status(200).json({ education });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// update education
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const { institution, degree, field, startDate, endDate, description } =
      req.body;

    // Find the education record
    const education = await prisma.education.findUnique({
      where: {
        id,
      },
    });

    // check if education exists
    if (!education) {
      return res.status(404).json({ error: "Education record not found" });
    }

    // find the candidate profile of the logged-in user
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if candidate exists
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Make sure the education belongs to candidate
    if (education.candidateId !== candidate.id) {
      return res.status(403).json({
        error: "You are not allowed to update this education record.",
      });
    }

    // Update education
    const updateEducation = await prisma.education.update({
      where: {
        id,
      },
      data: {
        institution,
        degree,
        field,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    });

    return res.status(200).json({
      message: "Education updated successfully",
      education: updateEducation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete education
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find education
    const education = await prisma.education.findUnique({
      where: {
        id,
      },
    });

    // check if education exists
    if (!education) {
      return res.status(404).json({ error: "Education record not found" });
    }

    // Find logged-in candidate
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // Check if candidate exists
    if (!candidate) {
      return res.status(404).json({
        error: "Candidate profile not found",
      });
    }

    // Check ownership
    if (education.candidateId !== candidate.id) {
      return res.status(403).json({
        error: "You are not allowed to delete this education record.",
      });
    }

    // Delete education
    await prisma.education.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Something went wrong");
  }
};

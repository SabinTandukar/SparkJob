import { prisma } from "../lib/prisma.js";

// create experience
export const createExperience = async (req, res) => {
  try {
    // Get experience from the request
    const { company, position, location, startDate, endDate, description } =
      req.body;

    //   validate required field
    if (!company || !position || !startDate) {
      return res
        .status(400)
        .json({ error: "Company, Position, Start date required" });
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

    // Create exprience record
    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        location,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    });

    return res
      .status(200)
      .json({ message: "Experience created successfully", experience });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all experience records
export const getExperience = async (req, res) => {
  try {
    // Find candidate profile
    const candidate = await prisma.experience.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Get all experience records belonging to this candidate
    const experience = await prisma.experience.findMany({
      where: {
        candidateId: candidate.id,
      },
    });

    return res.status(200).json({ experience });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// update experience
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const { company, position, location, startDate, endDate, description } =
      req.body;

    // find the experience record
    const experience = await prisma.experience.findUnique({
      where: {
        id,
      },
    });

    // check if experience exists
    if (!experience) {
      return res.status(404).json({ error: "Experience record not found" });
    }

    // find the candidate profile of the logged in user
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Make sure the experience belongs to candidate
    if (experience.candidateId !== candidate.id) {
      return res.status(403).json({
        error: "You are not allowed to update this experience",
      });
    }

    // update experience
    const updateExperience = await prisma.experience.update({
      where: {
        id,
      },
      data: {
        company,
        position,
        location,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    });

    return res.status(200).json({
      message: "Experience updated successfully",
      experience: updateExperience,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete experience
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    // find experience
    const experience = await prisma.experience.findUnique({
      where: {
        id,
      },
    });

    // check if experience exists
    if (!experience) {
      return res.status(404).json({ error: "Experience record not found" });
    }

    // find logged-in candidate
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if candidate exists
    if (!candidate) {
      return res.status(404).json({
        error: "Candiate profile not found",
      });
    }

    // check ownership
    if (experience.candidateId !== candidate.id) {
      return res.status(403).json({
        error: "You are not allowed to delete this experience",
      });
    }

    // Delete experience
    await prisma.experience.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

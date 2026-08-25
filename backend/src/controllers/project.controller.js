import { prisma } from "../lib/prisma.js";

// create project
export const createProject = async (req, res) => {
  try {
    // get experience from the request
    const { title, description, url, githubUrl, technologies } = req.body;

    // validate required filed
    if (!title) {
      return res.status(400).json({ error: "Title required" });
    }

    // find the candidate profile belonging to the logged-in user
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if candidate exists
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Create project record
    const project = await prisma.project.create({
      data: {
        candidateId: candidate.id,
        title,
        description,
        url,
        githubUrl,
        technologies,
      },
    });

    return res
      .status(200)
      .json({ message: "Project created successfully", project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all project records
export const getProject = async (req, res) => {
  try {
    // find candidate profile
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Get all project records belonging to this candidate
    const projects = await prisma.project.findMany({
      where: {
        candidateId: candidate.id,
      },
    });

    return res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, url, githubUrl, technologies } = req.body;

    // find the project
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    // check if project exists
    if (!project) {
      return res.status(404).json({ error: "Project record not found" });
    }

    // find the candidate profile of the logged-in user
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Make sure the experience belongs to candidate
    if (project.candidateId !== candidate.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update this experience" });
    }

    // update project
    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        url,
        githubUrl,
        technologies,
      },
    });

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // find project
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    // check if project exists
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // find logged-in candidate
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if candidates exists
    if (!candidate) {
      return res.status(404).json({
        error: "Candidate profile not found",
      });
    }

    // check ownership
    if (project.candidateId !== project.id) {
      return res.status(403).json({
        error: "You are not allowed to delete this project",
      });
    }

    // delete project
    await prisma.project.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

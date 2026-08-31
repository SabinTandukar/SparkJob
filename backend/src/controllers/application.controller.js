import { prisma } from "../lib/prisma.js";
import { createNotification } from "../utils/notification.js";

// Apply for job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // find candidate profile
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check candidate exists
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // check if job exists
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        recruiter: true,
      },
    });

    // check if job exists
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // check if job status is open
    if (job.status !== "OPEN") {
      // reject application
      return res.status(400).json({ error: "Job is closed" });
    }

    // check if the deadline had passed
    if (job.deadline && new Date() > job.deadline) {
      return res.status(400).json({ error: "Job is past the deadline" });
    }

    // check if candidate already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: candidate.id,
          jobId,
        },
      },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ error: "You've already applied for this job" });
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        candidateId: candidate.id,
        jobId,
        coverLetter,
      },
    });

    // Notify recruiter
    await createNotification({
      data: {
        userId: job.recruiter.userId,
        title: "New Job Application",
        message: `A candidate has applied for ${job.title}`,
        type: "APPLICATION_RECEIVED",
      },
    });

    return res
      .status(200)
      .json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// get candidates application
export const getMyApplications = async (req, res) => {
  try {
    // Find candidate profile
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check candidate exists
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found." });
    }
    // find applications belonging to candidate
    const jobApplications = await prisma.jobApplication.findMany({
      where: {
        candidateId: candidate.id,
      },
      // include job information
      include: {
        job: true,
      },
      // show newest application first
      orderBy: {
        createdAt: "desc",
      },
    });

    if (jobApplications.length === 0) {
      return res
        .status(400)
        .json({ error: "You have not applied for job yet" });
    }

    // return applications
    return res.status(200).json({ jobApplications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

// get one application
export const getApplicationById = async (req, res) => {
  try {
    // get application id from url
    const { id } = req.params;

    // Find the application
    const application = await prisma.jobApplication.findUnique({
      where: {
        id,
      },
      // include job application
      include: {
        job: true,
      },
    });

    // check if application exists
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // find logged-in candidate
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if candidate exists
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // check ownership
    if (application.candidateId !== candidate.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to view this application" });
    }

    // return application
    return res.status(200).json({ application });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

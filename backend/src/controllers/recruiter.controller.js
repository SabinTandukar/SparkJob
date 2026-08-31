import { prisma } from "../lib/prisma.js";

// create getMyJobs
export const getMyJobs = async (req, res) => {
  try {
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if recruiter exists
    if (!recruiter) {
      return res
        .status(404)
        .json({ error: "Recruiter profile does not exists" });
    }

    // find jobs belonging to that recruiter
    const jobs = await prisma.job.findMany({
      where: {
        recruiterId: recruiter.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // return jobs
    return res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// recruiter dashboard statistics
export const getRecruiterStatus = async (req, res) => {
  try {
    // get recruiter
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if recruiter exists
    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter profile not found" });
    }

    // get totaljobs
    const totalJobs = await prisma.job.count({
      where: {
        recruiterId: recruiter.id,
      },
    });

    // get openJobs
    const openJobs = await prisma.job.count({
      where: {
        recruiterId: recruiter.id,
        status: "OPEN",
      },
    });

    // get closedJob
    const closedJobs = await prisma.job.count({
      where: {
        recruiterId: recruiter.id,
        status: "CLOSED",
      },
    });

    // total applications
    const totalApplications = await prisma.jobApplication.count({
      where: {
        job: {
          recruiterId: recruiter.id,
        },
      },
    });

    // shortlisted
    const shortlisted = await prisma.jobApplication.count({
      where: {
        job: {
          recruiterId: recruiter.id,
        },
      },
    });

    // interview
    const interviews = await prisma.jobApplication.count({
      where: {
        job: {
          recruiterId: recruiter.id,
        },
        status: "INTERVIEW",
      },
    });

    // hired
    const hired = await prisma.jobApplication.count({
      where: {
        job: {
          recruiterId: recruiter.id,
        },
        status: "HIRED",
      },
    });

    // return
    return res.status(200).json({
      statistics: {
        totalJobs,
        openJobs,
        closedJobs,
        totalApplications,
        shortlisted,
        interviews,
        hired,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

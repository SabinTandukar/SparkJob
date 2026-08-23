import { prisma } from "../lib/prisma.js";

export const createJob = async (req, res) => {
  try {
    // Get data from request
    const {
      title,
      description,
      location,
      employeeType,
      salaryMin,
      salaryMax,
      requirements,
      skills,
    } = req.body;

    // Validate data
    if (!title || !description || !employeeType) {
      return res
        .status(400)
        .json({ error: "Title, description, and employee type are required." });
    }

    // get authenticated recruiter
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter profile not found" });
    }

    // create job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        employeeType,
        salaryMin,
        salaryMax,
        requirements,
        skills,
        recruiterId: recruiter.id,
      },
    });

    // send successful response
    return res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

export const getJobs = async (req, res) => {
  try {
    // get all jobs
    const jobs = await prisma.job.findMany({
      where: {
        status: "OPEN",
      },
      // include company/recruiter information
      include: {
        recruiter: {
          select: {
            companyName: true,
          },
        },
      },
      // new jobs first
      orderBy: {
        createdAt: "desc",
      },
    });
    // only show open jobs
    return res.status(200).json({ jobs });

    // return jobs
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

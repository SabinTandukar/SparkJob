import { prisma } from "../lib/prisma.js";

// create job
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
      status,
      deadline,
    } = req.body;

    // Validate data
    if (!title || !description || !employeeType || !deadline) {
      return res.status(400).json({
        error: "Title, description, employee type, and deadline are required.",
      });
    }

    // convert deadline to date
    const jobDeadline = new Date(deadline);

    // check whether the supplied date is actually valid
    if (isNaN(jobDeadline.getTime())) {
      return res.status(400).json({ error: "Invalid deadline" });
    }

    // make sure the deadline is in the future
    if (jobDeadline <= new Date()) {
      return res.status(400).json({ error: "Deadline must be in the future" });
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
        status,
        deadline: jobDeadline,
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

// get all jobs
export const getJobs = async (req, res) => {
  try {
    // get all jobs
    const jobs = await prisma.job.findMany({
      where: {
        status: "OPEN",
        deadline: {
          // gt->greater than
          gt: new Date(),
        },
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

// get single job
export const getSingleJob = async (req, res) => {
  try {
    // get id from the url
    const { id } = req.params;
    // find the jobs with prisma
    const job = await prisma.job.findUnique({
      where: {
        id,
      },
      //   include company name
      include: {
        recruiter: {
          select: {
            companyName: true,
          },
        },
      },
    });

    // check whether the job exists
    if (!job) {
      return res.status(404).json({ error: "Job Not found" });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

// update job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      location,
      employeeType,
      salaryMin,
      salaryMax,
      requirements,
      skills,
      status,
      deadline,
    } = req.body;

    // find job
    const job = await prisma.job.findUnique({
      where: {
        id,
      },
    });

    // check if job exists
    if (!job) {
      return res.status(404).json({ error: "Job Not found" });
    }

    // find authenticated recruiter
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if recruiter exists
    if (!recruiter) {
      return res.status(404).json({
        error: "Recruiter profile not found.",
      });
    }

    // Check job belongs to logged-in recruiter
    if (job.recruiterId !== recruiter.id) {
      return res.status(403).json({
        error: "You are not allowed to update this job.",
      });
    }

    // validate deadline only if recruiter provided one
    let validateDeadline;

    if (deadline !== undefined) {
      validateDeadline = new Date(deadline);

      if (isNaN(validateDeadline.getTime())) {
        return res.status(400).json({ error: "Invalid deadline" });
      }

      if (validateDeadline <= new Date()) {
        return res
          .status(400)
          .json({ error: "Deadline must be in the future" });
      }
    }

    // updateJob
    const updateData = Object.fromEntries(
      Object.entries({
        title,
        description,
        location,
        employeeType,
        salaryMin,
        salaryMax,
        requirements,
        skills,
        status,
        deadline: validateDeadline,
      }).filter(([_, value]) => value !== undefined),
    );

    const updateJob = await prisma.job.update({
      where: {
        id,
      },
      data: updateData,
    });

    return res.status(200).json({
      message: "Job updated successfully",
      job: updateJob,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// delete job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the job
    const job = await prisma.job.findUnique({
      where: {
        id,
      },
    });

    // check if job exists
    if (!job) {
      return res.status(404).json({ error: "Job Not Found" });
    }

    // find the recruiter profile
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check recruiter profile
    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter Profile Not Found" });
    }

    // check ownership
    if (job.recruiterId !== recruiter.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this job." });
    }

    // Delete the job
    await prisma.job.delete({
      where: {
        id,
      },
    });

    // return output
    return res.status(200).json({
      error: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

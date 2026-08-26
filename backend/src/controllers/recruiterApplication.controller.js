import { prisma } from "../lib/prisma.js";

// get recruiter application
export const getRecruiterApplications = async (req, res) => {
  try {
    // find recruiter profile
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });
    // check recruiter exists
    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter profile not found" });
    }
    // // find applications for recruiter's job
    // const jobs = await prisma.job.findMany({
    //   where: {
    //     recruiterId: recruiter.id,
    //   },
    // });

    // // check if jobs exists
    // if (jobs.length === 0) {
    //   return res
    //     .status(200)
    //     .json({ applications: [], message: "Job does not exists" });
    // }

    // find applications belonging to those jobs
    const applications = await prisma.jobApplication.findMany({
      where: {
        job: {
          recruiterId: recruiter.id,
        },
      },
      // include candidate and job information
      include: {
        candidate: true,
        job: true,
      },
    });

    // handle no applications
    if (applications.length === 0) {
      return res.status(200).json({
        applications: [],
        message: "No applications recieved yet.",
      });
    }
    // return applications
    return res.status(200).json({ applications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// get one application from recruiter
export const getRecruiterApplicationById = async (req, res) => {
  try {
    // get application id from url
    const { id } = req.params;

    // find the application
    const application = await prisma.jobApplication.findUnique({
      where: {
        id,
      },
    });

    // check if application exists
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Find recruiter profile belonging to logged-in user
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // check if recruiter exists
    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter profile not found" });
    }

    // find the job associated with this application
    const job = await prisma.job.findUnique({
      where: {
        id: application.jobId,
      },
    });

    // check job exists
    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    // Make sure this job belongs to the logged-in recruiter
    if (job.recruiterId !== recruiter.id) {
      return res.status(403).json({
        error: "You are not allowed to view this application",
      });
    }

    // Get candidate profile
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        id: application.candidateId,
      },
      include: {
        education: true,
        experiences: true,
        projects: true,
        certifications: true,
      },
    });

    // Check candidate exists
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Return application and candidate
    return res.status(200).json({ application, job, candidate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    // Get application from url
    const { id } = req.params;

    // Get new status from request body
    const { status } = req.body;

    // validate status
    const allowedStatus = [
      "APPLIED",
      "REVIEWING",
      "SHORTLISTED",
      "INTERVIEW",
      "HIRED",
      "REJECTED",
    ];

    // validate status
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid application status" });
    }

    // Find the application
    const application = await prisma.jobApplication.findUnique({
      where: {
        id,
      },
    });

    // Check application exists
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Find logged-in recruiter
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });
    // check if recruiter exists
    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter profile not found" });
    }

    // find the job belonging to this application
    const job = await prisma.job.findUnique({
      where: {
        id: application.jobId,
      },
    });

    // check job exists
    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    // Make sure this recruiter owns the job
    if (job.recruiterId !== recruiter.id) {
      return res.status(403).json({
        error: "You are not allowed to update this application",
      });
    }

    // update application status
    const updatedApplication = await prisma.jobApplication.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

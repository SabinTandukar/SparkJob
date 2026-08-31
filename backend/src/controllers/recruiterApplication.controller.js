import { prisma } from "../lib/prisma.js";
import { createNotification } from "../utils/notification.js";

// get recruiter application
export const getRecruiterApplications = async (req, res) => {
  try {
    // get pagination parameters
    const {
      page = 1,
      limit = 10,
      status,
      jobId,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // convert query parameters to numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // validate pagination
    if (
      !Number.isInteger(pageNumber) ||
      !Number.isInteger(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive number" });
    }

    // Prevent excessively large request
    if (limitNumber > 100) {
      return res
        .status(400)
        .json({ error: "Limit cannot be greater than 100" });
    }

    // calculate skip
    const skip = (pageNumber - 1) * limitNumber;

    // allowed application statuses
    const allowedStatus = [
      "APPLIED",
      "REVIEWING",
      "SHORTLISTED",
      "INTERVIEW",
      "HIRED",
      "REJECTED",
    ];

    // valid status
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        error: "Invalid application status",
      });
    }

    // Allowed sorting fields
    const allowedSortFields = ["createdAt", "status"];

    // validate sort field
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: "Invalid sort field",
      });
    }

    // validate sort order
    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        error: "Invalid sort order",
      });
    }

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

    // Build where condition
    const where = {
      job: {
        recruiterId: recruiter.id,
      },
    };

    // filter by application status
    if (status) {
      where.status = status;
    }

    // filter by specific job
    if (jobId) {
      where.jobId = jobId;
    }

    // count
    const totalApplications = await prisma.jobApplication.count({
      where,
    });

    // get applications
    const applications = await prisma.jobApplication.findMany({
      where,
      // pagination
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: "desc",
      },
      // include candidate and job information
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            employeeType: true,
          },
        },
      },
    });

    // calculate total pages
    const totalPages = Math.ceil(totalApplications / limitNumber);

    // return response
    return res.status(200).json({
      applications,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalApplications,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ==========================================
// GET ONE RECRUITER APPLICATION
// ==========================================

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

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================
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

    // return response
    return res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

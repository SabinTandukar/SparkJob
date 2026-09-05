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
export const getRecruiterStats = async (req, res) => {
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

    // Get statistics and recent applications
    const [
      totalJobs,
      openJobs,
      closedJobs,
      totalApplications,
      shortlisted,
      interviews,
      hired,
      recentApplications,
    ] = await Promise.all([
      // Total jobs
      prisma.job.count({
        where: {
          recruiterId: recruiter.id,
        },
      }),

      // Open jobs
      prisma.job.count({
        where: {
          recruiterId: recruiter.id,
          status: "OPEN",
          deadline: {
            gt: new Date(),
          },
        },
      }),

      // Closed jobs
      prisma.job.count({
        where: {
          recruiterId: recruiter.id,
          status: "CLOSED",
        },
      }),

      // Total applications
      prisma.jobApplication.count({
        where: {
          job: {
            recruiterId: recruiter.id,
          },
        },
      }),

      // Shortlisted applications
      prisma.jobApplication.count({
        where: {
          job: {
            recruiterId: recruiter.id,
          },
          status: "SHORTLISTED",
        },
      }),

      // Interview applications
      prisma.jobApplication.count({
        where: {
          job: {
            recruiterId: recruiter.id,
          },
          status: "INTERVIEW",
        },
      }),

      // Hired applications
      prisma.jobApplication.count({
        where: {
          job: {
            recruiterId: recruiter.id,
          },
          status: "HIRED",
        },
      }),

      // Recent applications
      prisma.jobApplication.findMany({
        where: {
          job: {
            recruiterId: recruiter.id,
          },
        },
        include: {
          candidate: {
            select: {
              firstName: true,
              lastName: true,
            },
          },

          job: {
            select: {
              id: true,
              title: true,
              location: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 5,
      }),
    ]);

    console.log("Recruiter ID:", recruiter.id);
    console.log("Recent Applications:", recentApplications);

    // return
    return res.status(200).json({
      recruiter: {
        companyName: recruiter.companyName,
      },
      statistics: {
        totalJobs,
        openJobs,
        closedJobs,
        totalApplications,
        shortlisted,
        interviews,
        hired,
      },

      recentApplications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

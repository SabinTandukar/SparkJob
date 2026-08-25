import { prisma } from "../lib/prisma.js";

// create certification
export const createCertification = async (req, res) => {
  try {
    // Get experience from the request
    const { name, issuer, issueDate, credentialUrl } = req.body;

    //   validate required field
    if (!name) {
      return res.status(400).json({ error: "Certificate name is required" });
    }

    // find the candidate profile belonging to the logged in user
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Create exprience record
    const certification = await prisma.certification.create({
      data: {
        candidateId: candidate.id,
        name,
        issuer,
        issueDate: issueDate ? new Date(issueDate) : null,
        credentialUrl,
      },
    });

    return res
      .status(200)
      .json({ message: "Certification created successfully", certification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all certification records
export const getCertification = async (req, res) => {
  try {
    // Find candidate profile
    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Get all certification records belonging to this candidate
    const certification = await prisma.certification.findMany({
      where: {
        candidateId: candidate.id,
      },
    });

    return res.status(200).json({ certification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// update certification
export const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, issuer, issueDate, credentialUrl } = req.body;

    // find the certification record
    const certification = await prisma.certification.findUnique({
      where: {
        id,
      },
    });

    // check if certification exists
    if (!certification) {
      return res.status(404).json({ error: "Certificate record not found" });
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

    // Make sure the certification belongs to candidate
    if (certification.candidateId !== candidate.id) {
      return res.status(403).json({
        error: "You are not allowed to update this certification",
      });
    }

    // update certification
    const updatedCertification = await prisma.certification.update({
      where: {
        id,
      },
      data: {
        name,
        issuer,
        issueDate: issueDate ? new Date(issueDate) : null,
        credentialUrl,
      },
    });

    return res.status(200).json({
      message: "Certification updated successfully",
      certification: updatedCertification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete certification
export const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;

    // find certification
    const certification = await prisma.certification.findUnique({
      where: {
        id,
      },
    });

    // check if certification exists
    if (!certification) {
      return res.status(404).json({ error: "Certificate record not found" });
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
    if (certification.candidateId !== candidate.id) {
      return res.status(403).json({
        error: "You are not allowed to delete this Certificate",
      });
    }

    // Delete certification
    await prisma.certification.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

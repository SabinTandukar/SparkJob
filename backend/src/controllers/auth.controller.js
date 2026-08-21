import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import generateToken from "../utils/generateToken.js";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    //Get data from request
    const { email, password, role, firstName, lastName, companyName } =
      req.body;

    // validate data
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Email, password, and role are required." });
    }

    // validate role
    if (role !== "CANDIDATE" && role !== "RECRUITER") {
      return res.status(400).json({
        error: "Role must be either CANDIDATE or RECRUITER.",
      });
    }

    // validate for candidate specific data
    if (role === "CANDIDATE") {
      if (!firstName || !lastName) {
        return res
          .status(400)
          .json({ error: "First Name and Last Name are required" });
      }
    }

    // validate for recruiter specific data
    if (role === "RECRUITER" && !companyName) {
      return res
        .status(400)
        .json({ error: "Company Name is required for recruiter account" });
    }

    // check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({ error: "Email already in use." });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // create user and appropriate profiles
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role,
        },
      });

      if (role === "CANDIDATE") {
        await tx.candidateProfile.create({
          data: {
            userId: newUser.id,
            firstName,
            lastName,
          },
        });
      }

      if (role === "RECRUITER") {
        await tx.recruiterProfile.create({
          data: {
            userId: newUser.id,
            companyName,
          },
        });
      }

      //   return the created user
      return newUser;
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    // send success response
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    // get email and password
    const { email, password } = req.body;

    // check if username and password entered
    if (!email || !password) {
      return res.status(400).json({ error: "Username and password required." });
    }

    // find the user using prisma
    const user = await prisma.user.findUnique({ where: { email } });

    // check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // use bcrypt.compare() to verify the password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // create jwt with generateToken : full in generateToken.js
    const token = generateToken({ userId: user.id, role: user.role });

    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login Successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const authenticate = async (req, res, next) => {
  try {
    //get authorization header
    const authHeader = req.headers.authorization;

    // check whether token exists
    if (!authHeader) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // extract barer token
    const [scheme, token] = authHeader.split(" ");

    // check both parts
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Invalid authorization format." });
    }

    // verify the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // put decoded informatin into req.user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    //check if user exists
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

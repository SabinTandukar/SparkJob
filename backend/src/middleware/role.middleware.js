export const requireRole = (requiredRole = "RECRUITER") => {
  return (req, res, next) => {
    try {
      //check whether req.user exists
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      //   get ther role from req.user
      const userRole = req.user.role;

      //   compare the roles
      if (userRole !== requiredRole) {
        return res.status(403).json({
          error: "You are not allowed to perform this action!",
        });
      }

      next();
    } catch (error) {
      console.error(error);
      // handle unexpected error
      return res.status(500).json({ error: "Something went wrong" });
    }
  };
};

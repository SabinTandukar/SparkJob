import { prisma } from "../lib/prisma.js";

export const createNotification = async ({ userId, title, message, type }) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
};

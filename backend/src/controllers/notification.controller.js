import { prisma } from "../lib/prisma.js";

// Get my notifications
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Mark notifications as read
export const markNotificationAsRead = async (req, res) => {
  try {
    // get id from params
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      return res.status(404).json({
        error: "Notification not found",
      });
    }

    // Make sure this notification belongs to logged-in user
    if (notification.userId !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to update this notification",
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      message: "Notification maked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

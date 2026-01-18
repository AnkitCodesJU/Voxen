import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getUserNotifications);
router.route("/mark-read").patch(markNotificationAsRead);
router.route("/mark-read/:notificationId").patch(markNotificationAsRead);

export default router;

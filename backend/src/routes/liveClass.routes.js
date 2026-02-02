import { Router } from "express";
import { 
    createLiveClass, 
    getLiveClasses, 
    getLiveClassById, 
    startLiveClass, 
    endLiveClass 
} from "../controllers/liveClass.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getLiveClasses);
router.route("/:liveClassId").get(getLiveClassById);

import { upload } from "../middlewares/multer.middleware.js";

// Secured routes
router.route("/create").post(verifyJWT, upload.single("thumbnail"), createLiveClass);
router.route("/:liveClassId/start").patch(verifyJWT, startLiveClass);
router.route("/:liveClassId/end").patch(verifyJWT, endLiveClass);

export default router;

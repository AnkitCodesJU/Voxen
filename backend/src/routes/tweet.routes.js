import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
    getAllTweets,
    getTweetById
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT to all routes in this file

router.route("/").post(upload.single("image"), createTweet).get(getAllTweets);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").get(getTweetById).patch(updateTweet).delete(deleteTweet);

export default router;

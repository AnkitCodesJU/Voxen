import { Router } from "express";
import { searchAll } from "../controllers/search.controller.js";

const router = Router();

router.route("/").get(searchAll);

export default router;

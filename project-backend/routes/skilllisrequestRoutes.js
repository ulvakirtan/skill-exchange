import express from "express";
import {createSkilllisting, getSkilllistingById, getSkilllistingsForUser,  deleteSkilllisting} from "../controllers/skilrequestRoute.js";
import { createSkillrequest } from "../controllers/skillrequestController.js";

const router = express.Router();
router.post("/", createSkillrequest);
router.get("/user/user:Id",getSkillrequestById);
router.get("/user/:userId", getSkillrequestsForUser);
router.delete("/:skillRequestId", deleteSkillrequest);

export default router;
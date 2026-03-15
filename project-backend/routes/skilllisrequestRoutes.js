import express from "express";
import { createSkillrequest, getSkillrequestById, getSkillrequestsForUser, deleteSkillrequest } from "../controllers/skillrequestController.js";

const router = express.Router();
router.post("/", createSkillrequest);
router.get("/user/user:Id",getSkillrequestById);
router.get("/user/:userId", getSkillrequestsForUser);
router.delete("/:skillRequestId", deleteSkillrequest);

export default router;
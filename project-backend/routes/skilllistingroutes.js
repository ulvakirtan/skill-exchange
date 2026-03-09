import express from "express";
import {createSkilllisting, getSkilllistingById, getSkilllistingsForUser,  deleteSkilllisting} from "../controllers/skilllistingController.js";

const router = express.Router();
router.post("/", createSkilllisting);
router.get("/user/user:Id",getSkilllistingById);
router.get("/user/:userId", getSkilllistingsForUser);
router.delete("/:skilllistingId", deleteSkilllisting);

export default router;
import e from "express";
import skillrequest from "../models/skillrequest.js";

export const createSkillrequest = async (req,res)=>{
    try{
        const {title,description,category,level,mode,sessionCount,createdBy}=req.body;
        const newskillrequest = await skillrequest.create({
            title,
            description,
            category,
            level,
            mode,
            sessionCount,
            createdBy});
            res.status(201).json({ success: true, skillrequest: newskillrequest });
    }
    catch(error){
        res.status(500).json({ success: false, message: "Error creating skillrequest", error: error.message });
    }
};

export const getSkillrequestById = async (req,res)=>{
    try{
        const skillrequestId = req.params.Id;
        const skillrequest = await skillrequest.findById(skillrequestId);
        if(!skillrequest){
            return res.status(404).json({ success: false, message: "Skillrequest not found" });
        }
        else{
            res.status(200).json({ success: true, skillrequest });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching skillrequest", error: error.message });
    }
};

export const getSkillrequestsForUser = async (req,res)=>{
    try{
        const userId = req.params.userId;
        const skillrequests = await skillrequest.find({ createdBy: userId });
        res.status(200).json({ success: true, skillrequests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching skillrequests for user", error: error.message });
    }};

export const deleteSkillrequest = async (req,res)=>{
    try{
        const skillrequestId = req.params.skillRequestId;
        const deletedSkillrequest = await skillrequest.findByIdAndDelete(skillrequestId);
        if(!deletedSkillrequest){
            return res.status(404).json({ success: false, message: "Skillrequest not found" });
        } else {
            res.status(200).json({ success: true, message: "Skillrequest deleted successfully" });
        };
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting skillrequest", error: error.message });
    }};
import skilllinsting from "../models/skilllisting.js";

export const createSkilllisting = async (req,res)=>{
    try {
        const {title,description,category,level,mode,sessionCount,createdBy}=req.body;
        const newskilllisting = await skilllinsting.create({
            title,
            description,
            category,
            level,
            mode,
            sessionCount,
            createdBy
        });
        res.status(201).json({ success: true, skilllisting: newskilllisting
        });
    }
    catch(error){
        res.status(500).json({ success: false, message: "Error creating skilllisting", error: error.message });
    };
};

export const getSkilllistingById = async (req,res)=>{
    try {
        const {skilllistingId} = req.params;
        const skilllistingData = await skilllinsting.findById(skilllistingId).populate("createdBy", "name");
        res.status(200).json({ success: true, skilllisting: skilllistingData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

export const getSkilllistingsForUser = async (req,res)=>{
    try {
        const {userId} = req.params;
        const skilllistings = await skilllinsting.find({createdBy: userId}).populate("createdBy", "name");
        res.status(200).json({ success: true, skilllistings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

export const deleteSkilllisting = async (req,res)=>{
    try {
        const {skilllistingId} = req.params;
        await skilllinsting.findByIdAndDelete(skilllistingId);
        res.status(200).json({ success: true, message: "Skilllisting deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

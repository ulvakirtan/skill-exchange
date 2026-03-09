import review from "../models/review.js";

export const createReview = async (req,res)=>
    {
        try {
            const {reviewerId,receiverId,rating,comment} = req.body;
            const newReview = await review.create({
                reviewerId,
                receiverId,
                rating,
                comment
            });
            res.status(201).json({ success: true, review: newReview });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

export const getReviewsForUser = async (req,res)=>
    {
        try {
            const {userId} = req.params;
            const reviews = await review.find({receiverId: userId}).populate("reviewerId", "name");
            res.status(200).json({ success: true, reviews });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

export const getReviewById = async (req,res)=> {
    try {
        const {reviewId} = req.params;
        const reviewData = await review.findById(reviewId).populate("reviewerId", "name").populate("receiverId", "name");
        res.status(200).json({ success: true, review: reviewData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req,res)=>
    {
        try {
            const {reviewId} = req.params;
            await review.findByIdAndDelete(reviewId);
            res.status(200).json({ success: true, message: "Review deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        } 
    };
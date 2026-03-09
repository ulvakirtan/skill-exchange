import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {reviewerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
rating:{
    type: Number,
    required: true,
    min: 1,
    max: 10
},
comment:{
    type: String,
    required: false
}
  },
  { timestamps: true }
);

const review = mongoose.model("review", reviewSchema);

export default review;

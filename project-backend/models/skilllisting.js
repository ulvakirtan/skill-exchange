import mongoose from "mongoose";

const skilllistingSchema = new mongoose.Schema(
  {title:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  sessionCount: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
  },
  { timestamps: true }
);

const skilllisting = mongoose.model("skilllisting", skilllistingSchema);

export default skilllisting;
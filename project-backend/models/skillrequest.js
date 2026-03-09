import mongoose from "mongoose";

const skillrequestSchema = new mongoose.Schema(
  {listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "skilllisting",
    required: true
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
  },
  { timestamps: true }
);

const skillrequest = mongoose.model("skillrequest", skillrequestSchema);

export default skillrequest;

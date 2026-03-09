import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
  
    email: {
      type: String,
      required: true,
      unique: true
    },
  
    password: {
      type: String,
      required: true
    },
  
    college: {
      type: String,
      required: true
  },
  
  skillsoffered: {
    type: [String],
    required: true
  },
  
  skillswanted: {
    type: [String],
    required: true},
  
  bio: {
    type: String,
    required: false
  },

  rating: {
    type: Number,
    required: false,
    default: 0
  }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
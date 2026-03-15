import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.skillsOffered = req.body.skillsOffered || user.skillsOffered;
      user.skillsWanted = req.body.skillsWanted || user.skillsWanted;
      
      const updatedUser = await user.save();
      
      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         bio: updatedUser.bio,
         skillsOffered: updatedUser.skillsOffered,
         skillsWanted: updatedUser.skillsWanted
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

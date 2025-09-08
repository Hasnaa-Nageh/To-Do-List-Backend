const User = require("./../models/user.model");
const bcrypt = require("bcrypt");

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.log(`Error: ${err}`);
    next(err);
  }
};

// Update current user profile
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updates.password = hashed;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    next(err);
  }
};

// Delete current user profile
const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.log(`Error: ${err}`);
    next(err);
  }
};

module.exports = { getProfile, updateProfile, deleteProfile };

const { generateAccessToken, generateRefreshToken } = require("../utils/token");
require("dotenv").config();
const User = require("./../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: "false", message: "All fields are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existUser = await User.findOne({ email: normalizedEmail });
    if (existUser) {
      return res
        .status(409)
        .json({ success: "false", message: "User Already Exist" });
    }
    const newUser = await User.create({
      username,
      email: normalizedEmail,
      password,
      role: "user",
    });
    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      // sameSite: isProduction ? "strict" : "lax",
      sameSite: "none",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, refreshToken: __, ...userData } = newUser.toObject();

    res.status(201).json({
      message: "Signup successful",
      user: userData,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ success: "false", message: "Email and Password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // sameSite: isProduction ? "strict" : "lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 1000, // 1 minute
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, refreshToken: rt, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const logOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: "false", message: "No refresh token found" });
    }
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      // sameSite: isProduction ? "strict" : "lax",
      sameSite: "none",
    };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword; // Middleware will hash this
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    console.log(
      "Manual refresh request with token:",
      refreshToken.substring(0, 20) + "..."
    );

    // Verify the refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      console.log("Refresh token verified for user:", payload.id);
    } catch (err) {
      console.log("Refresh token verification failed:", err.message);
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Find user by ID
    const user = await User.findById(payload.id);
    if (!user) {
      console.log("User not found for ID:", payload.id);
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if stored refresh token matches
    if (user.refreshToken !== refreshToken) {
      console.log("Stored refresh token doesn't match");
      return res.status(403).json({
        success: false,
        message: "Refresh token does not match",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);
    console.log("New access token generated");

    // Set the new access token as a cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      // sameSite: isProduction ? "strict" : "lax",
      sameSite: "none",
      maxAge:15* 60 * 1000, // 1 minute
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
      expiresIn: "1 minute",
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    next(err);
  }
};

const me = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, logOut, changePassword, refreshToken, me };

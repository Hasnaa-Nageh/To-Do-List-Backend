// require("dotenv").config();

// const jwt = require("jsonwebtoken");
// const User = require("./../models/user.model");
// const { generateAccessToken } = require("./../utils/token");

// async function authenticateToken(req, res, next) {
//   try {
//     const token =
//       req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token missing",
//       });
//     }

//     // First try to verify the access token
//     try {
//       try {
//         // Decode token
//         const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

//         const user = await User.findById(payload.id);

//         if (!user) {
//           return res.status(401).json({
//             success: false,
//             message: "User not found",
//           });
//         }

//         req.user = user;
//         return next();
//       } catch (accessError) {
//         if (accessError.name === "TokenExpiredError") {
//           console.log("Access token expired, attempting refresh...");
//           await handleTokenRefresh(req, res, next);
//         } else {
//           return res.status(403).json({
//             success: false,
//             message: "Invalid access token",
//           });
//         }
//       }
//     } catch (accessError) {
//       // If token is expired, try to refresh it
//       if (accessError.name === "TokenExpiredError") {
//         console.log("Access token expired, attempting refresh...");
//         await handleTokenRefresh(req, res, next);
//       } else {
//         return res.status(403).json({
//           success: false,
//           message: "Invalid access token",
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// }

// async function handleTokenRefresh(req, res, next) {
//   try {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token expired and no refresh token available",
//       });
//     }

//     console.log("Refresh token found:", refreshToken.substring(0, 20) + "...");

//     // Verify the refresh token
//     let refreshPayload;
//     try {
//       refreshPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//       console.log("Refresh token verified for user:", refreshPayload.id);
//     } catch (refreshError) {
//       console.log("Refresh token verification failed:", refreshError.message);
//       return res.status(403).json({
//         success: false,
//         message: "Refresh token is invalid or expired",
//       });
//     }

//     // Find user by ID from refresh token
//     const user = await User.findById(refreshPayload.id);
//     if (!user) {
//       console.log("User not found for ID:", refreshPayload.id);
//       return res.status(403).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Check if stored refresh token matches
//     if (user.refreshToken !== refreshToken) {
//       console.log("Stored refresh token doesn't match");
//       return res.status(403).json({
//         success: false,
//         message: "Refresh token does not match",
//       });
//     }

//     // Generate new access token
//     const newAccessToken = generateAccessToken(user);
//     console.log("New access token generated");

//     // Set new access token in cookie
//     const isProduction = process.env.NODE_ENV === "production";
//     res.cookie("accessToken", newAccessToken, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? "strict" : "lax",
//       maxAge: 60 * 1000, // 1 minute
//     });

//     // Set user in request and continue
//     req.user = { id: user._id, role: user.role };
//     console.log("Token refreshed successfully, continuing to route");
//     next();
//   } catch (error) {
//     console.error("Token refresh error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during token refresh",
//     });
//   }
// }

// module.exports = { authenticateToken };

const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, userData) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.user = userData;
    next();
  });
}

module.exports = { authenticateToken };

const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profile.controller");
const express = require("express");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const router = express.Router();

// Profile

// Profile routes
router.get("/", authenticateToken, getProfile);
router.put("/", authenticateToken, updateProfile);
router.delete("/", authenticateToken, deleteProfile);

module.exports = router;

const express = require("express");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const authorize = require("../middleware/authorize.middleware");
const {
  getAllUser,
  getAllTasks,
  DeleteUser,
} = require("../controllers/admin.controller");
const router = express.Router();

router.get("/user", authenticateToken, authorize("admin"), getAllUser);
router.get("/task", authenticateToken, authorize("admin"), getAllTasks);
router.delete("/user/:id", authenticateToken, authorize("admin"), DeleteUser);
module.exports = router;

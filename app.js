const express = require("express");
const app = express();
const authRouter = require("./routes/auth.route");
const taskRoute = require("./routes/task.route");
const profileRouter = require("./routes/profile.route");
const adminRoutes = require("./routes/admin.route");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend API is running");
});
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/task", taskRoute);
app.use("/api/admin", adminRoutes);
module.exports = app;

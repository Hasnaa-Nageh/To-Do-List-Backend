// require("dotenv").config();
// const app = require("./app");
// const connectDB = require("./config/db");

// const PORT = process.env.PORT || 3000;

// connectDB();

// app.listen(PORT, () => {
//   console.log(`Server Running On Port ${PORT}`);
// });

require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

module.exports = app;

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded images statically
app.use(
  "/data/users/profileImages",
  express.static(path.join(__dirname, "data/users/profileImages"))
);

// Routes Import
const userRoutes = require("./Routes/User/UserRoutes");
const userProfileRoutes = require("./Routes/User/ProfileRoutes");
const blogRoutes = require("./Routes/User/BlogRoutes");
const startupRoutes = require("./Routes/Startup/ProfileRoutes");

const connectDb = require("./Config/db");

// Adding Config File Contents to process
require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT || 8000;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

// Defining API's
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/profile", userProfileRoutes);
app.use("/api/v1/blog", blogRoutes);

app.use("/api/v1/startup", startupRoutes);

// Database Connection
connectDb(CONNECTION_STRING);

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`);
});

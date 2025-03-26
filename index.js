const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const path = require("path");

require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/users", userRoutes);

// All routes available 
console.log("Available Routes:");
app._router.stack.forEach((middleware) => {
  if (middleware.route) { 
    console.log(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
  } else if (middleware.name === "router") { 
    middleware.handle.stack.forEach((subMiddleware) => {
      if (subMiddleware.route) {
        console.log(`${Object.keys(subMiddleware.route.methods)[0].toUpperCase()} ${middleware.regexp} ${subMiddleware.route.path}`);
      }
    });
  }
});

// server runnig Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || "development";
  console.log(`Server running in ${env} mode on http://localhost:${PORT}`);
});

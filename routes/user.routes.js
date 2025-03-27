const express = require("express");
const { signup, login } = require("../controllers/user.controllers");
const User = require("../models/user.model");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Unable to fetch users" });
  }
});

module.exports = router;

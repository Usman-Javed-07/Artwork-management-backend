
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Signup Function
const signup = async (req, res) => {
  const { username, email, password, FirstName, LastName } = req.body;

  try {
    if (!username || !email || !password || !FirstName || !LastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Save the user with the hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      FirstName,  
      LastName    
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { username: newUser.username, email: newUser.email },
      token,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
        const errorMessages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: "Validation failed", errors: errorMessages });
    }
    res.status(500).json({ message: "Error processing request", error: err.message });
  }
};

// Login Function
const login = async (req, res) => {
  const { email, password } = req.body; 

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email 
    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Stored Hashed Password:", user.password); 

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); 

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      email: user.email, // Return the email of the user
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Error processing request", error: err.message });
  }
};

module.exports = { signup, login };

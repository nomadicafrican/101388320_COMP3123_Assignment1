const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// POST /api/v1/user/signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "please input all fields!" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User already exists! Make a new user" });
  }

  const hash = await bcrypt.hash(password, 15);

  const newUser = new User({
    username,
    email,
    password: hash,
  });

  await newUser.save();
  res
    .status(201)
    .json({ message: "User created successfully.", user_id: newUser._id });
});

// POST /api/v1/user/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "please input all fields!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User doesnt exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "password is invalid" });
  }

  res.status(200).json({ message: "Login was successful" });
});

module.exports = router;

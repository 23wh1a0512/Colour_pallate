const crypto = require("crypto");
const User = require("../models/user.model");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createPasswordHash = (password) =>
  crypto.createHash("sha256").update(password).digest("hex");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Please provide your full name.",
      });
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (typeof password !== "string" || password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      passwordHash: createPasswordHash(password),
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
      error: error.message,
    });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!EMAIL_PATTERN.test(normalizedEmail) || typeof password !== "string" || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email and password.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.passwordHash !== createPasswordHash(password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  logIn,
};

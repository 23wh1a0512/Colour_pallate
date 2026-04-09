const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const paletteRoutes = require("./routes/paletteRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const frontendDirectory = path.join(__dirname, "..", "..", "frontend");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDirectory));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Color palette API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/palette", paletteRoutes);
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  return res.sendFile(path.join(frontendDirectory, "index.html"));
});
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

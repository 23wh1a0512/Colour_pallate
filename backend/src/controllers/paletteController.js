const Palette = require("../models/Palette");
const { generatePalette } = require("../utils/colorUtils");

// Generate palette (not saved)
const generateNewPalette = (req, res) => {
  const palette = generatePalette();
  res.status(200).json({ palette });
};

// Save palette
const savePalette = async (req, res) => {
  try {
    const { name, colors } = req.body;

    const newPalette = new Palette({
      name,
      colors
    });

    await newPalette.save();

    res.status(201).json({
      message: "Palette saved successfully",
      data: newPalette
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all saved palettes
const getPalettes = async (req, res) => {
  try {
    const palettes = await Palette.find().sort({ createdAt: -1 });
    res.status(200).json(palettes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateNewPalette,
  savePalette,
  getPalettes
};

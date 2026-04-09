const Palette = require("../models/palette.model");
const {
  generatePalette,
  isValidHexColor,
  sanitizePaletteInput,
} = require("../utils/colorUtils");

const generateNewPalette = (req, res) => {
  const requestedCount = Number.parseInt(req.query.count, 10);
  const count = Number.isNaN(requestedCount) ? 5 : requestedCount;
  const palette = generatePalette(count);

  res.status(200).json({
    success: true,
    data: {
      palette,
    },
  });
};

const savePalette = async (req, res) => {
  try {
    const { name, colors } = req.body;
    const sanitizedColors = sanitizePaletteInput(colors);

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid palette name.",
      });
    }

    if (sanitizedColors.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one HEX color.",
      });
    }

    const invalidColor = sanitizedColors.find((color) => !isValidHexColor(color));

    if (invalidColor) {
      return res.status(400).json({
        success: false,
        message: `Invalid HEX color received: ${invalidColor}`,
      });
    }

    const newPalette = new Palette({
      name: name.trim(),
      colors: sanitizedColors,
    });

    await newPalette.save();

    res.status(201).json({
      success: true,
      message: "Palette saved successfully.",
      data: newPalette,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to save palette.",
      error: error.message,
    });
  }
};

const getPalettes = async (req, res) => {
  try {
    const palettes = await Palette.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: palettes.length,
      data: palettes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch palettes.",
      error: error.message,
    });
  }
};

const updatePalette = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, colors } = req.body;
    const updatePayload = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid palette name.",
        });
      }

      updatePayload.name = name.trim();
    }

    if (colors !== undefined) {
      const sanitizedColors = sanitizePaletteInput(colors);

      if (sanitizedColors.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide at least one HEX color.",
        });
      }

      const invalidColor = sanitizedColors.find((color) => !isValidHexColor(color));

      if (invalidColor) {
        return res.status(400).json({
          success: false,
          message: `Invalid HEX color received: ${invalidColor}`,
        });
      }

      updatePayload.colors = sanitizedColors;
    }

    if (!Object.keys(updatePayload).length) {
      return res.status(400).json({
        success: false,
        message: "Please provide a palette name or colors to update.",
      });
    }

    const updatedPalette = await Palette.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updatedPalette) {
      return res.status(404).json({
        success: false,
        message: "Palette not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Palette updated successfully.",
      data: updatedPalette,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update palette.",
      error: error.message,
    });
  }
};

const toggleFavoritePalette = async (req, res) => {
  try {
    const { id } = req.params;

    const palette = await Palette.findById(id);

    if (!palette) {
      return res.status(404).json({
        success: false,
        message: "Palette not found.",
      });
    }

    palette.isFavorite = !palette.isFavorite;
    await palette.save();

    res.status(200).json({
      success: true,
      message: palette.isFavorite
        ? "Palette added to favorites."
        : "Palette removed from favorites.",
      data: palette,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update favorite status.",
      error: error.message,
    });
  }
};

const deletePalette = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPalette = await Palette.findByIdAndDelete(id);

    if (!deletedPalette) {
      return res.status(404).json({
        success: false,
        message: "Palette not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Palette deleted successfully.",
      data: deletedPalette,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete palette.",
      error: error.message,
    });
  }
};

module.exports = {
  generateNewPalette,
  savePalette,
  getPalettes,
  updatePalette,
  toggleFavoritePalette,
  deletePalette,
};

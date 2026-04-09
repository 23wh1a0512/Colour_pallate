const mongoose = require("mongoose");

const paletteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Untitled Palette",
    },
    colors: {
      type: [String],
      required: true,
      validate: {
        validator: (colors) => Array.isArray(colors) && colors.length > 0,
        message: "A palette must include at least one color.",
      },
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Palette", paletteSchema);

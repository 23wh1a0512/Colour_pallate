const mongoose = require("mongoose");

const paletteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    colors: {
      type: [String], // Array of HEX colors
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Palette", paletteSchema);

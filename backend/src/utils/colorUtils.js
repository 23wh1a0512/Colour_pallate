const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/i;

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

const generatePalette = (count = 5) => {
  const paletteSize = Number.isInteger(count) && count > 0 ? count : 5;
  const palette = [];

  for (let i = 0; i < paletteSize; i++) {
    palette.push(generateRandomColor());
  }

  return palette;
};

const isValidHexColor = (color) =>
  typeof color === "string" && HEX_COLOR_PATTERN.test(color.trim());

const sanitizePaletteInput = (colors) => {
  if (!Array.isArray(colors)) {
    return [];
  }

  return colors
    .map((color) => (typeof color === "string" ? color.trim().toUpperCase() : color))
    .filter(Boolean);
};

module.exports = {
  generatePalette,
  isValidHexColor,
  sanitizePaletteInput,
};

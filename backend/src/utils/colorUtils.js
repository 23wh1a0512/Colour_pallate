const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generatePalette = (count = 5) => {
  const palette = [];
  for (let i = 0; i < count; i++) {
    palette.push(generateRandomColor());
  }
  return palette;
};

module.exports = { generatePalette };

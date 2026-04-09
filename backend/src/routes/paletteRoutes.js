const express = require("express");
const router = express.Router();

const {
  generateNewPalette,
  savePalette,
  getPalettes,
  updatePalette,
  toggleFavoritePalette,
  deletePalette,
} = require("../controllers/paletteController");

router.get("/", getPalettes);
router.post("/", savePalette);
router.put("/:id", updatePalette);
router.patch("/:id/favorite", toggleFavoritePalette);
router.delete("/:id", deletePalette);
router.get("/generate", generateNewPalette);

// Backward-compatible aliases for existing clients.
router.post("/save", savePalette);
router.get("/all", getPalettes);

module.exports = router;

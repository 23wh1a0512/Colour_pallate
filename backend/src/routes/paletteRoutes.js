const express = require("express");
const router = express.Router();
const {
  generateNewPalette,
  savePalette,
  getPalettes
} = require("../controllers/paletteController");

router.get("/generate", generateNewPalette);
router.post("/save", savePalette);
router.get("/all", getPalettes);

module.exports = router;

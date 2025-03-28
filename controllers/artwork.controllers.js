const Artwork = require("../models/artwork.model");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.createArtwork = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const filename = `${Date.now()}_${req.file.originalname}`;
      const outputPath = path.join(__dirname, "../uploads/", filename);

      await sharp(req.file.path)
        .resize(800, 800, { fit: "inside" })
        .toFile(outputPath);

      fs.unlinkSync(req.file.path); // Remove original file
      imageUrl = `/uploads/${filename}`;
    }

    const artwork = await Artwork.create({ ...req.body, pictureUrl: imageUrl });
    res.status(201).json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.findAll();
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });
    res.json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    await artwork.update(req.body);
    res.json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    if (artwork.pictureUrl) {
      fs.unlinkSync(path.join(__dirname, "../uploads/", path.basename(artwork.pictureUrl)));
    }

    await artwork.destroy();
    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

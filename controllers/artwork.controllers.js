const Artwork = require("../models/artwork.model");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.createArtwork = async (req, res) => {
  try {
    let imageUrl = "";
    let invoiceUrl = "";
    let additionalPictures = [];

    // Handle main picture
    if (req.files?.picture?.[0]) {
      const pictureFile = req.files.picture[0];
      const pictureName = `${Date.now()}_${pictureFile.originalname}`;
      const picturePath = path.join(__dirname, "../uploads/", pictureName);

      await sharp(pictureFile.path)
        .resize(800, 800, { fit: "inside" })
        .toFile(picturePath);

      fs.unlinkSync(pictureFile.path);
      imageUrl = `/uploads/${pictureName}`;
    } else {
      return res.status(400).json({ error: "Picture is required." });
    }

    // Handle invoice
    if (req.files?.invoice?.[0]) {
      const invoiceFile = req.files.invoice[0];
      const invoiceName = `${Date.now()}_${invoiceFile.originalname}`;
      const invoicePath = path.join(__dirname, "../uploads/", invoiceName);

      fs.renameSync(invoiceFile.path, invoicePath);
      invoiceUrl = `/uploads/${invoiceName}`;
    }

    // Handle additional pictures
    if (req.files?.additionalPictures?.length) {
      for (const file of req.files.additionalPictures) {
        const additionalName = `${Date.now()}_${file.originalname}`;
        const additionalPath = path.join(__dirname, "../uploads/", additionalName);

        await sharp(file.path)
          .resize(800, 800, { fit: "inside" })
          .toFile(additionalPath);

        fs.unlinkSync(file.path);
        additionalPictures.push(`/uploads/${additionalName}`);
      }
    }

    const artwork = await Artwork.create({
      ...req.body,
      pictureUrl: imageUrl,
      invoiceUrl: invoiceUrl,
      additionalPictures: additionalPictures,
    });

    res.status(201).json(artwork);
  } catch (error) {
    console.error("Error while creating artwork:", error);
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

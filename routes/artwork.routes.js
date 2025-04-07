const express = require("express");
const router = express.Router();
const artworkController = require("../controllers/artwork.controllers");
const upload = require("../middleware/upload");

router.post(
    "/",
    upload.fields([
      { name: "picture", maxCount: 1 },
      { name: "invoice", maxCount: 1 }
    ]),
    artworkController.createArtwork
  );
  
router.get("/", artworkController.getArtworks);
router.get("/:id", artworkController.getArtworkById);
router.put("/:id", artworkController.updateArtwork);
router.delete("/:id", artworkController.deleteArtwork);

module.exports = router;

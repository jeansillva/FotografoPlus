import express from "express";
import multer from "multer";
import {
  createAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  addPhoto,
  updatePhoto,
  deletePhoto,
  uploadMany,
} from "../controllers/albumController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", uploadMany, createAlbum);
router.get("/", getAlbums);
router.put("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);

router.post("/:id/photos", upload.single("photo"), addPhoto);
router.put("/:albumId/photos/:photoId", updatePhoto);
router.delete("/:albumId/photos/:photoId", deletePhoto);

export default router;

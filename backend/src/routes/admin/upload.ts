import { Router } from "express";
import multer from "multer";
import { processAndSaveImage } from "../../services/imageService";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// Configuration de multer pour la gestion des fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images sont autorisées"));
    }
  },
});

/**
 * Route pour l'upload d'image
 * POST /api/admin/upload/image
 */
router.post(
  "/image",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Aucune image fournie" });
    }

    try {
      const filename = await processAndSaveImage(
        req.file.buffer,
        req.file.originalname
      );

      res.json({
        success: true,
        filename,
        url: `/uploads/${filename}`,
      });
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error);
      res.status(500).json({
        error: "Erreur lors du traitement de l'image",
      });
    }
  })
);

export default router;

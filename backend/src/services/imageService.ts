import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 80;
const WEBP_QUALITY = 75;

// Assure que le dossier uploads existe
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Traite et sauvegarde une image
 * @param buffer Buffer de l'image
 * @param originalName Nom original du fichier
 * @returns Le nom du fichier sauvegardé
 */
export async function processAndSaveImage(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  await ensureUploadDir();

  // Génère un nom unique pour le fichier
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${uuidv4()}${ext}`;
  const webpFilename = `${uuidv4()}.webp`;
  const filepath = path.join(UPLOAD_DIR, filename);
  const webpFilepath = path.join(UPLOAD_DIR, webpFilename);

  try {
    // Analyse de l'image
    const metadata = await sharp(buffer).metadata();
    const isTransparent = metadata.hasAlpha;

    // Redimensionne et optimise l'image
    const processedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY })
      .toBuffer();

    // Crée une version WebP si l'image n'est pas transparente
    if (!isTransparent) {
      await sharp(buffer)
        .resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpFilepath);
    }

    // Sauvegarde le fichier original optimisé
    await fs.writeFile(filepath, processedBuffer);

    // Retourne le nom du fichier WebP s'il existe, sinon le nom du fichier original
    return isTransparent ? filename : webpFilename;
  } catch (error) {
    console.error("Erreur lors du traitement de l'image:", error);
    throw new Error("Erreur lors du traitement de l'image");
  }
}

/**
 * Supprime une image
 * @param filename Nom du fichier à supprimer
 */
export async function deleteImage(filename: string): Promise<void> {
  const filepath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.unlink(filepath);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'image ${filename}:`,
      error
    );
  }
}

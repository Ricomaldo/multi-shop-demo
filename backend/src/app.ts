import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";
import uploadRouter from "./routes/admin/upload";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Servir les fichiers statiques
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Route d'upload uniquement (le reste est dans server.ts)
app.use("/api/admin/upload", uploadRouter);

export default app;

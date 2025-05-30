import { Router } from "express";
import productsRouter from "./products";
import shopsRouter from "./shops";

const router = Router();

router.use("/products", productsRouter);
router.use("/shops", shopsRouter);

export default router;

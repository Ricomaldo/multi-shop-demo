import { Router } from "express";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import shopsRouter from "./shops";

const router = Router();

router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/shops", shopsRouter);

export default router;

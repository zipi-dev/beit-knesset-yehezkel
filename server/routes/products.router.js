import { Router } from "express";
import { getAllProducts,addProduct ,updateProduct, deleteProduct } from "../controllers/products.controllers.js";
import { validateProduct } from "../middlewares/product.middleware.js";

const router = Router();

router.get('/', getAllProducts);
router.post('/', validateProduct, addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
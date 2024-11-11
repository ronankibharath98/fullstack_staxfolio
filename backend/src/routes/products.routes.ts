import express from "express"
import { getProducts, addProducts } from "../controllers/products.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { singleUpload } from "../middleware/multer";


const router = express.Router()

router.route("/addProduct").post(isAuthenticated, singleUpload, addProducts)
router.route("/getProducts").get(isAuthenticated, getProducts)
router.route("/mystax").get(getProducts)

export default router;
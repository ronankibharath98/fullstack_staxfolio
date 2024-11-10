import express from "express"
import { getProducts, uploadProducts } from "../controllers/products.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { singleUpload } from "../middleware/multer";


const router = express.Router()

router.route("/uploadProducts").post(isAuthenticated, singleUpload, uploadProducts)
router.route("/getProducts").get(isAuthenticated, getProducts)
router.route("/mystax").get(getProducts)

export default router;
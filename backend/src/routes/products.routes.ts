import express from "express"
import { getProducts } from "../controllers/products.controller";


const router = express.Router()


router.route("/mystax").get(getProducts)
router.route("/upload").get(getProducts)
router.route("/mystax").get(getProducts)

export default router;
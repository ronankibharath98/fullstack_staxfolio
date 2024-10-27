import express from "express"
import { getMyStack } from "../controllers/stax.controller";


const router = express.Router()


router.route("/mystax").get(getMyStack)

export default router;
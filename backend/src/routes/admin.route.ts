import express from "express"
import { AdminSignin, adminSignup } from "../controllers/admin.controller"

const router = express.Router()


router.route("/signup").post(adminSignup)
router.route("/signin").post(AdminSignin)


export default router;
import express from "express"
import { adminSignin, adminSignup, orgEmailVerification, orgOtpVerification } from "../controllers/admin.controller"

const router = express.Router()


router.route("/email").post(orgEmailVerification)
router.route("/email/verify-otp").post(orgOtpVerification)
router.route("/signup").post(adminSignup)
router.route("/signin").post(adminSignin)

export default router;
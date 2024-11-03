import express from "express"
import { adminSignin, adminSignup, orgEmailVerification, orgOtpVerification } from "../controllers/admin.controller"
import { sigleUpload } from "../middleware/multer"

const router = express.Router()


router.route("/email").post(orgEmailVerification)
router.route("/email/verify-otp").post(orgOtpVerification)
router.route("/signup").post(sigleUpload, adminSignup)
router.route("/signin").post(adminSignin)

export default router;
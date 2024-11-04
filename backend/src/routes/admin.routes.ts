import express from "express";
import { adminSignin, 
        adminSignup, 
        orgEmailVerification, 
        orgOtpVerification, 
        uploadProducts,
    } from "../controllers/admin.controller";
import { singleUpload } from "../middleware/multer";

const router = express.Router()


router.route("/email").post(orgEmailVerification)
router.route("/email/verify-otp").post(orgOtpVerification)
router.route("/signup").post(singleUpload, adminSignup)
router.route("/signin").post(adminSignin)
router.route("/uploadProducts").post(uploadProducts)

export default router;
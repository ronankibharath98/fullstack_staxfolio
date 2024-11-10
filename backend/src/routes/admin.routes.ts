import express from "express";
import { adminLogout, adminSignin, 
        adminSignup, 
        orgEmailVerification, 
        orgOtpVerification, 
        uploadProducts,
    } from "../controllers/admin.controller";
import { singleUpload } from "../middleware/multer";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router()


router.route("/email").post(orgEmailVerification)
router.route("/email/verify-otp").post(orgOtpVerification)
router.route("/signup").post(singleUpload, adminSignup)
router.route("/signin").post(adminSignin)
router.route("/logout").get(adminLogout)
router.route("/uploadProducts").post(isAuthenticated, singleUpload, uploadProducts)

export default router;
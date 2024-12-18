import express from "express";
import { adminSignout, adminSignin, 
        adminSignup, 
        getAdminProducts, 
        getAdminProfile, 
        orgEmailVerification, 
        orgOtpVerification,
        updateAdminProfile, 
    } from "../controllers/admin.controller";
import { singleUpload } from "../middleware/multer";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router()


router.route("/email").post(orgEmailVerification)
router.route("/email/verify-otp").post(orgOtpVerification)
router.route("/signup").post(singleUpload, adminSignup)
router.route("/signin").post(adminSignin)
router.route("/signout").post(isAuthenticated, adminSignout)
router.route("/profile").get(isAuthenticated, getAdminProfile)
router.route("/updateProfile").post(isAuthenticated, updateAdminProfile)
router.route("/getMyProducts").get(isAuthenticated, getAdminProducts)

export default router;
import express from "express";
import { emailVerify, getUserProfile, otpVerify, userSignout, userSignin, userSignup } from "../controllers/user.controller";
import { singleUpload } from "../middleware/multer";
import { isAuthenticated } from "../middleware/isAuthenticated";


const router = express.Router();


router.route("/email").post(emailVerify);
router.route("/email/verify-otp").post(otpVerify);
router.route("/signup").post(singleUpload, userSignup);
router.route("/signin").post(userSignin);
router.route("/signout").post(isAuthenticated, userSignout);
router.route("/profile").get(isAuthenticated, getUserProfile);


export default router;
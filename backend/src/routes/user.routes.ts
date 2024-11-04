import express from "express";
import { emailVerify, otpVerify, userSignin, userSignup } from "../controllers/user.controller";
import { singleUpload } from "../middleware/multer";


const router = express.Router();


router.route("/email").post(emailVerify)
router.route("/email/verify-otp").post(otpVerify)
router.route("/signup").post(singleUpload, userSignup)
router.route("/signin").post(userSignin)


export default router;
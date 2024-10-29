import express from "express";
import { emailVerify, otpVerify, userSignin, userSignup } from "../controllers/user.controller";


const router = express.Router();


router.route("/email").post(emailVerify)
router.route("/email/verify-otp").post(otpVerify)
router.route("/signup").post(userSignup)
router.route("/signin").post(userSignin)

export default router;
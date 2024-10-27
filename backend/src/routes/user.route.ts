import express from "express";
import { emailVerify, otpVerify, userSignup } from "../controllers/user.controller";


const router = express.Router();


router.route("/email").post(emailVerify)
router.route("/email/verify-otp").post(otpVerify)
router.route("/signup").post(userSignup)

export default router;
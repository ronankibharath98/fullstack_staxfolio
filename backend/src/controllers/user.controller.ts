import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { EmailAuthInput, EmailOtpInput, SigninInput, SignupInput } from "../zod/zodSchema";
import { sendEmailConf } from "../utils/emailAuthConfirmation"
import bcrypt from "bcrypt"
import { z } from "zod";

const prisma = new PrismaClient();

// {
//     log: ['query', 'info', 'warn', 'error']
// }

export const emailVerify = async( req: Request, res: Response): Promise<void> => {
    try {

        const {email} = EmailAuthInput.parse(req.body);

        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (existingEmail && 
            (existingEmail.password != null || existingEmail.password != undefined) &&
            (existingEmail.firstName != null || existingEmail.firstName != undefined) &&
            (existingEmail.lastName != null || existingEmail.lastName != undefined)
        ) {
            res.status(400).json({
                message: "Email already used, use a different email or signin",
                success: false
            })
            return
        }

        const otp  = Math.floor(10000000 + Math.random() * 90000000).toString()
        // send otp email to user 
        await sendEmailConf(email, otp);

        // add the otp to user model to verify on the next route when user gets otp email 
        await prisma.user.upsert({
            where: {email},
            update: {otp},
            create: {email, otp}
        })
        res.status(200).json({
            message: "OTP generated successfully",
            success: true
        })
        return
    } catch (error) {
        res.status(500).json
        return
    }
}

export const otpVerify = async(req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = EmailOtpInput.parse(req.body);

        const otpRecord = await prisma.user.findUnique({
            where: {email}
        })

        if(!otpRecord || otpRecord.otp!=otp){
            res.status(400).json({
                message: "Otp not matching",
                success: false
            })
            return
        }
        
        res.status(200).json({
            message: "OTP verified successfully",
            success: true
        })
        return

    } catch (error) {
        res.status(500).json({
            mesage: "Error in server while verifying otp",
            success: false,
            error
        })
        return
    }
}

export const userSignup = async(req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password } = SignupInput.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await prisma.user.upsert({
            where: {email},
            update: {
                firstName: firstName,
                lastName: lastName,
                password: hashedPassword
            },
            create: {
                firstName: firstName,
                lastName: lastName,
                email,
                password: hashedPassword
            }
        })
        res.status(200).json({
            message: "User created successfully",
            success: true,
            user
        })
        return
    } catch (error) {
        if (error instanceof z.ZodError){
            res.status(400).json({
                messagE: "Validation Error",
                success: false,
                error: error.issues.map(e => e)
            })
            return
        }
        res.status(500).json({
            message: "There is a server error in user register",
            success: false,
            error
        })
        return
    }
}

export const userSignin = async( req: Request, res: Response ): Promise<void> => {
    const {email, password} = SigninInput.parse(req.body);
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if(!user){
            res.status(404).json({
                message: "User with the email id not found, Try signing up",
                success: false
            })
            return
        }

        if(!user.password){
            res.status(400).json({
                message: "This account requires an alternative login method (e.g., OAuth).",
                success: false
            })
            return
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if(!isPasswordMatch){
            res.status(400).json({
                message: "Password did not match, Please login again",
                success: false
            })
            return
        }

        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        })
        return

    } catch (error) {
        res.status(500).json({
            message: "Server error in user signin",
            success: false,
            error
        })
        return
    }
}
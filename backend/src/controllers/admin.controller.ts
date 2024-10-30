import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { z } from "zod"
import { AdminOtpInput, AdminSigninInput, AdminSignupInput, OrgEmailAuthInput } from "../zod/zodAdminSchema";
import { Request, Response } from "express";
import { sendEmailConf } from "../utils/emailAuthConfirmation";
import { hash } from "crypto";

const prisma = new PrismaClient();

export const orgEmailVerification = async( req: Request, res: Response): Promise<void>  => {
    try{
        const { orgEmail }: any = OrgEmailAuthInput.parse(req.body);

        const admin = await prisma.admin.findUnique({
            where: {orgEmail}
        })

        if (admin && 
            (admin.password != null || admin.password != undefined) &&
            (admin.orgName != null || admin.orgName != undefined)
        ) {
            res.status(400).json({
                message: "Email already used, use a different email or signin",
                success: false
            })
            return
        }

        const otp = Math.floor(10000000 + Math.random()*90000000).toString()

        await sendEmailConf(orgEmail, otp)

        await prisma.admin.upsert({
            where: {orgEmail},
            update: {otp},
            create: {orgEmail, otp}
        })
        res.status(200).json({
            message: "OTP generated successfully",
            success: true
        })
        return
    }catch(error){
        res.status(500).json({
            message: "Server error in sending otp verification",
            success: false,
            error
        })
        return
    }
}

export const orgOtpVerification = async( req: Request, res: Response ): Promise<void> => {
    try {
        const { orgEmail, otp } = AdminOtpInput.parse(req.body);

        const admin = await prisma.admin.findUnique({
            where: {orgEmail}
        })

        if(admin?.otp != otp){
            res.status(404).json({
                message: "OTP mismatch, regenerate otp",
                success: false
            })
        }

        res.status(200).json({
            message: "OTP verified successfully",
            success: true
        })
        return
        
    } catch (error) {
        res.status(500).json({
            message: "Server error in Verifying the otp",
            success: false,
            error
        })
        return
    }
}

// Admin signup controller
export const adminSignup = async( req: Request, res: Response ): Promise<void> => {
    try {
        const { orgEmail, orgName, password} = AdminSignupInput.parse(req.body);
        const orgEmailExist = await prisma.admin.findUnique({
            where: {orgEmail}
        })

        if( orgEmailExist?.orgEmail &&
            orgEmailExist?.orgName &&
            orgEmailExist.password){
            res.status(400).json({
                message: "User already existing with this emial, Please login using the same email",
                success: true,
            })
            return   
        }

        const hashedPasssword = await bcrypt.hash(password, 10)

        const admin  = await prisma.admin.upsert({
            where: {orgEmail},
            update: {
                orgName: orgName,
                password: hashedPasssword
            },
            create:{
                orgEmail,
                orgName,
                password: hashedPasssword
            }
        })

        res.status(200).json({
            message: "Admin registered successfully",
            success: true,
            admin
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
            message: "Server error in Admin Signup",
            error
        })
        return
    }

}

// Admin signin controller
export const adminSignin = async( req: Request, res: Response): Promise<void> => {
    try {
        const { orgEmail, password } = AdminSigninInput.parse(req.body);

        const admin = await prisma.admin.findFirst({
            where:{
                orgEmail: orgEmail
            }
        })
        if(!admin){
            res.status(404).json({
                message: "Admin email not found",
                success: false
            })
            return
        }

        if(!admin.password){
            res.status(404).json({
                message: "Admin password not found",
                success: false
            })
            return
        }

        const isPasswordMatch = await bcrypt.compare( password, admin.password )

        if(!isPasswordMatch){
            res.status(404).json({
                message: "Passowrd did not match, Please check and re-login",
                success: false
            })
            return
        }

        res.status(200).json({
            message: "Admin logged in successfully",
            success: true,
            admin: {
                email: admin.orgEmail,
                name: admin.orgName
            }
        })
        return

    } catch (error) {
        res.status(500).json({
            message: "Server error in Admin Signin",
            success: false,
            error
        })
        return
    }
}
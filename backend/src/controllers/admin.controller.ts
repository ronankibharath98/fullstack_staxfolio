import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { z } from "zod"
import { AdminSigninInput, AdminSignupInput } from "../zod/zodAdminSchema";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Admin signup controller
export const adminSignup = async( req: Request, res: Response ): Promise<void> => {
    try {
        const {orgEmail, orgName, password} = AdminSignupInput.parse(req.body);
        const orgEmailExist = await prisma.admin.findUnique({
            where: {orgEmail}
        })

        if(orgEmailExist){
            res.status(400).json({
                message: "User already existing with this emial, Please login using the same email",
                success: true,
            })
            return   
        }

        const hashedPasssword = await bcrypt.hash(password, 10)

        const admin  = await prisma.admin.create({
            data: {
                orgEmail: orgEmail,
                orgName: orgName,
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
            message: "Server error in Admin Signup"
        })
        return
    }

}

// Admin signin controller
export const AdminSignin = async( req: Request, res: Response): Promise<void> => {
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
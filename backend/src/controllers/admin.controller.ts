import { AdminOtpInput, AdminSigninInput, AdminSignupInput, OrgEmailAuthInput } from "../zod/zodAdminSchema";
import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { sendEmailConf } from "../utils/emailAuthConfirmation";
import { fromEnv } from "@aws-sdk/credential-provider-env"
import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { z } from "zod"

const prisma = new PrismaClient();

const s3 = new S3Client({
    credentials: fromEnv(),
    region: process.env.AWS_REGION
})

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
                message: "Email already exists",
                success: false
            })
            return
        }

        const otp = Math.floor(10000000 + Math.random()*90000000).toString()

        await sendEmailConf(orgEmail, otp)

        await prisma.verifyAdminOtp.create({
            data: {
                orgEmail: orgEmail,
                otp: otp
            }
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

        const admin = await prisma.verifyAdminOtp.findUnique({
            where: {orgEmail: orgEmail}
        })

        if(admin?.otp != otp){
            res.status(404).json({
                message: "OTP mismatch, regenerate otp",
                success: false
            })
        }

        await prisma.verifyAdminOtp.upsert({
            where: {
                orgEmail: orgEmail
            },
            update: {
                verified: true
            },
            create: {
                orgEmail,
                otp,
                verified: true
            }
        })

        await prisma.admin.create({
            data: {
                orgEmail: orgEmail
            }
        })

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
        const adminExist = await prisma.admin.findUnique({
            where: {orgEmail}
        })

        if( adminExist?.orgEmail &&
            adminExist?.orgName &&
            adminExist.password){
            res.status(400).json({
                message: "User already exists with this emial",
                success: true,
            })
            return   
        }

        const hashedPasssword = await bcrypt.hash(password, 10)

        let profilePhotoUrl: string | undefined
        const file = req.file

        if(file){
            const params= {
                Bucket: process.env.AWS_S3_BUCKET as string,
                Key: `profile-photos/${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype as string,
                ACL: 'public-read' as ObjectCannedACL,
            }

            try {
                await s3.send(new PutObjectCommand(params));
                profilePhotoUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
            } catch (s3Error) {
                res.status(500).json({
                    message: "Failed to upload profile photo",
                    success: false,
                    error: s3Error
                });
                return;
            }
        }   

        const admin  = await prisma.admin.upsert({
            where: {orgEmail},
            update: {
                orgName: orgName,
                password: hashedPasssword,
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
                message: "Validation Error",
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
                message: "Password did not match",
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
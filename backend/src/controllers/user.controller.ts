import { EmailAuthInput, EmailOtpInput, SigninInput, SignupInput } from "../zod/zodSchema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { sendEmailConf } from "../utils/emailAuthConfirmation";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod";

const prisma = new PrismaClient();
const s3 = new S3Client({
    credentials: fromEnv(),
    region: process.env.AWS_REGION
})

// {
//     log: ['query', 'info', 'warn', 'error']
// }

export const emailVerify = async( req: Request, res: Response): Promise<void> => {
    try {

        const {email} = EmailAuthInput.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (user &&
            (user.password != null || user.password != undefined) &&
            (user.firstName != null || user.firstName != undefined) &&
            (user.lastName != null || user.lastName != undefined)
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
        await prisma.verifyUserOtp.upsert({
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
        res.status(500).json({
            mesage: "Error in server while verifying otp",
            success: false,
            error
        })
        return
    }
}

export const otpVerify = async(req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = EmailOtpInput.parse(req.body);

        const otpRecord = await prisma.verifyUserOtp.findUnique({
            where: {email}
        })

        if(!otpRecord || otpRecord.otp!=otp){
            res.status(400).json({
                message: "Otp not matching",
                success: false
            })
            return
        }

        await prisma.verifyUserOtp.upsert({
            where: {email},
            update: {
                verified: true
            },
            create: {
                email,
                otp,
                verified: true
            }
        })

        await prisma.user.create({
            data:{
                email: email
            }
        })

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

        const userExists = await prisma.user.findUnique({
            where: {email}
        })

        const verificationRecord = await prisma.verifyUserOtp.findUnique({
            where: {email}
        })

        if (!verificationRecord || !verificationRecord.verified) {
            res.status(400).json({
                message: "Email not verified. Please verify your email before signing up.",
                success: false,
            });
            return 
        }

        if( userExists?.email &&
            userExists?.firstName &&
            userExists?.lastName &&
            userExists.password){
            res.status(400).json({
                message: "User already exists with this emial",
                success: true,
            })
            return   
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        let profilePhotoUrl: string | undefined
        const file = req.file
        
        
        if(file){
            const params= {
                Bucket: process.env.AWS_S3_BUCKET as string,
                Key: `/user/${email}/uploads/profileImages/${Date.now()}_${file.originalname}`,
                ContentType: file.mimetype as string,
                // ACL: 'public-read' as ObjectCannedACL,
            }

            const command  = new PutObjectCommand(params)
            profilePhotoUrl = await getSignedUrl(s3, command, {expiresIn: 3600})

        }   
        
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

        if(profilePhotoUrl && file){
            await prisma.userMetadata.create({
                data:{
                    url: profilePhotoUrl,
                    name: file.originalname,
                    type: file.mimetype,
                    size: file.size.toString(),
                    userId: user.id,
                }
            })
        }

        res.status(200).json({
            message: "User created successfully",
            success: true,
            user:{
                firstName: firstName,
                lastName: lastName,
                email: email
            },
            uploadUrl: profilePhotoUrl
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
        if (!email || !password){
            res.status(404).json({
                message: "Please enter all the fields",
                success: false
            })
            return
        }
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

        const tokenData = {
            userId: user.id,
            email: user.email
        }

        const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {expiresIn: "1d"})

        res.status(200).cookie("token", token, {
            // httpOnly: true,
            maxAge: 1 * 24 * 60 * 60 * 1000
        }).json({
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

export const getProducts = async(req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.product.findMany();

        res.status(200).json({
            message: "Products retrived successfully",
            success: true,
            products
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error in view products",
            success: false,
            error
        })
        return
    }
}
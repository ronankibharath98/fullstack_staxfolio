import { AdminOtpInput, AdminSigninInput, AdminSignupInput, OrgEmailAuthInput, UploadProductInput } from "../zod/zodAdminSchema";
import { PutObjectCommand, GetObjectAclCommand , S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { sendEmailConf } from "../utils/emailAuthConfirmation";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";


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
        const { orgEmail, orgName, password } = AdminSignupInput.parse(req.body);
        const adminExist = await prisma.admin.findUnique({
            where: {orgEmail}
        })

        const verificationRecord = await prisma.verifyAdminOtp.findUnique({
            where: { orgEmail },
        });

        if (!verificationRecord || !verificationRecord.verified) {
            res.status(400).json({
                message: "Email not verified. Please verify your email before signing up.",
                success: false,
            });
            return 
        }

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

        let profilePhotoUrl: string | undefined;
        let s3Key: string | undefined;
        const file = req.file;      
        
        if(file){
            s3Key = `/admin/${orgEmail}/uploads/profileImages/${Date.now()}_${file.originalname}`;
            const params= {
                Bucket: process.env.AWS_S3_BUCKET as string,
                Key: s3Key,
                ContentType: file.mimetype as string,
                // ACL: 'public-read' as ObjectCannedACL,
            }

            const command  = new PutObjectCommand(params);
            //presigned url for put object
            profilePhotoUrl = await getSignedUrl(s3, command, {expiresIn: 3600});

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

        if(profilePhotoUrl && file){
            await prisma.adminMetadata.create({
                data: {
                    url: s3Key as string,
                    name: file.originalname,
                    type: file.mimetype,
                    size: file.size.toString(),
                    adminId: admin.id,
                }
            })
        }

        const tokenData = {
            user_id: admin.id,
            orgEmail: admin.orgEmail,
            role: admin.role
        }

        const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {expiresIn:"1d"})

        res.status(200).cookie("token", token,{
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax"
        }).json({
            message: "Admin registered successfully",
            success: true,
            admin:{
                name: orgName,
                email: orgEmail
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
            message: "Server error in Admin Signup",
            error
        })
        return
    }

}

// Admin signin controller
export const adminSignin = async(req: Request, res: Response): Promise<void> => {
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

        const isPasswordMatch = await bcrypt.compare(password, admin.password)

        if(!isPasswordMatch){
            res.status(404).json({
                message: "Password did not match",
                success: false
            })
            return
        }

        const tokenData = {
            userId: admin.id,
            email: admin.orgEmail,
            role: admin.role
        }

        const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, { expiresIn: "1d"})

        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }).json({
            message: "Admin logged in successfully",
            success: true,
            admin: {
                email: admin.orgEmail,
                name: admin.orgName,
                role: admin.role
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

export const adminLogout = async(req: Request, res: Response): Promise<void> => {
    try{
        res.status(200).cookie("token", "",{maxAge: 0} ).json({
            message: "Admin logged out successfully",
            success: true
        })
        return
    } catch(error){
        res.status(500).json({
            message: "Server error in admin logout",
            success: false
        })
        return
    }
}

export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminId = req.id

        const adminProfile = await prisma.admin.findUnique({
            where: {
                id: adminId
            }
        })
        if(!adminProfile){
            res.status(404).json({
                message: "Admin profile data not found",
                success: false
            })
            return
        }
        res.status(200).json({
            message: "Admin profile data fetched successfully",
            success: true,
            adminProfile:{
                email: adminProfile.orgEmail,
                name: adminProfile.orgName,
                role: adminProfile.role
            }
        })
        return
    } catch (error) {
        res.status(500).json({
            message: "Server error in retriving admin profile data",
            success: false
        })
        return
    }
}

export const updateAdminProfile = async(req: Request, res: Response): Promise<void> => {
    try {
        const { orgName, oldPassword, newPassword } = req.body;
        const adminId = req.id;

        const admin = await prisma.admin.findUnique({
            where: {
                id: adminId
            }
        })

        if (!admin){
            res.status(404).json({ message: "Admin not found", success: false })
            return
        }

        const updateData: any = {};

        if (orgName) {
            updateData.orgName = orgName;
        }
        if (newPassword) {
            if(!oldPassword){
                res.status(400).json({ message: "Current password is required",status: false })
                return
            }
            if(!admin.password){
                res.status(404).json({ message: "Admin password not found", success: false })
                return
            }    
            const isPasswordMatch = await bcrypt.compare(oldPassword, admin.password)
            if (!isPasswordMatch) {
                res.status(400).json({ message: "Current password did not match", success: false });
                return;
            }
            const hashedPasssword = await bcrypt.hash(newPassword,10);
            updateData.password = hashedPasssword
        }

        // Update the admin profile
        const updatedAdmin = await prisma.admin.update({
            where: { id: adminId },
            data: updateData,
        });

        res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            admin: updatedAdmin,
        });
        return
    } catch (error) {
        res.status(500).json({
            message: "Server error in edit profile",
            success: false
        })
    }
}

export const getAdminProducts = async(req: Request, res: Response): Promise<void> => {
    try {
        const adminId = req.id
        
        const adminProducts = await prisma.product.findMany({
            where: {
                adminId: adminId
            }
        })

        if(!adminProducts || adminProducts.length == 0){
            res.status(200).json({
                message: "No products found for admin",
                success: true
            })
            return
        }
        res.status(200).json({
            message: "Successfully fetched admin products",
            success: true,
            adminProducts
        })
        return
    } catch (error) {
        res.status(500).json({
            message: "Server error in fetching Admin products",
            success: false
        })
        return
    }
}
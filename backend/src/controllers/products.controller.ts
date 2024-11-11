import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UploadProductInput } from "../zod/zodAdminSchema";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const s3 = new S3Client({
    credentials: fromEnv(),
    region: process.env.AWS_REGION
})

export const addProducts = async(req: Request, res: Response): Promise<void> => {
    try {
        const { name, title, description, tags} =  UploadProductInput.parse(req.body);
        const adminId = req.id
        const file = req.file;

        const productExists = await prisma.product.findUnique({
            where: {name}
        })

        if(productExists){
            res.status(404).json({
                message: "Product with the same name already exists",
                success: false,
            })
            return
        }
        
        if (!adminId) {
            res.status(404).json({
                message: "Admin not found",
                success: false,
            });
            return;
        }
        const tagsArray = tags ? tags.split(',') : [];
        const orgEmail = req.email;
        let productUrl: string | undefined;
        let s3Key: string | undefined;
        if(file){
            s3Key = `/admin/${orgEmail}/uploads/productImage/${Date.now()}_${file.originalname}`;
            const params= {
                Bucket: process.env.AWS_S3_BUCKET as string,
                Key: s3Key,
                ContentType: file.mimetype as string,
                // ACL: 'public-read' as ObjectCannedACL,
            }

            const command  = new PutObjectCommand(params)
            //pre signed url for PutObjectCommand
            productUrl = await getSignedUrl(s3, command, {expiresIn: 3600})

            const product = await prisma.product.create({
                data: {
                    name: name,
                    title: title,
                    description: description,
                    tags: tagsArray,
                    adminId: adminId
                }
            })

            if (s3Key && file){
                await prisma.productMetadata.create({
                    data: {
                        name: file.originalname,
                        url: s3Key,
                        type: file.mimetype,
                        size: file.size.toString(),
                        productId: product.id,
                    }
                })
            }
        }  
        res.status(200).json({
            message: "Product udpated successfully",
            success: true,
            productUrl
        })
        return
    } catch (error) {
        res.status(500).json({
            message: "Server error in uploading product",
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
        return
    } catch (error) {
        res.status(500).json({
            message: "Server error in view products",
            success: false,
            error
        })
        return
    }
}

import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"


interface JwtPayload {
    userId: string;
    email: string;
  }

export const isAuthenticated = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        if(!token){
            res.status(401).json({
                message: "User not authenticated",
                success: false
            })
        }
        
        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(!decode || !decode.userId){
            res.status(401).json({
                messsage: "Invalid token",
                status: false
            })
            return
        }
        req.id = decode.userId
        req.email = decode.email
        next();
    } catch (error) {
        res.status(500).json({
            message: "Server error in authentication",
            success: false
        })
        return
    }
}
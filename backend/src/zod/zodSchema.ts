import { z } from "zod"

export const EmailAuthInput = z.object({
    email: z.string().email(), 
})

export const EmailOtpInput = z.object({
    email: z.string().email(),
    otp: z.string()
})

export const SignupInput = z.object({
    firstName: z.string(),
    lastName: z.string(), 
    email: z.string().email(),
    password: z
    .string()
    .min(8, {message: "Password must be atleast 8 characters long"})
    .regex(/[A-Z]/, {message: "Password must contain atleast one uppercase"})
    .regex(/[a-z]/, {message: "Password must contain atleast one lowercase"})
    .regex(/\d/, {message: "Password must contain atleast one number"})
    .regex(/[@$%&*?]/, {message: "Password must contain atleast one character"})
})

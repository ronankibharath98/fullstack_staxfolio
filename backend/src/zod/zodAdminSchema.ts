import { z } from "zod"

export const OrgEmailAuthInput = z.object({
    orgEmail: z.string().email()
})


export const AdminOtpInput = z.object({
    orgEmail: z.string().email(),
    otp: z.string()
})

export const AdminSignupInput = z.object({
    orgName: z.string(),
    orgEmail: z.string().email(),
    password: z
    .string()
    .min(8, {message: "Password must be atleast 8 characters long"})
    .regex(/[A-Z]/, {message: "Password must contain atleast one uppercase"})
    .regex(/[a-z]/, {message: "Password must contain atleast one lowercase"})
    .regex(/\d/, {message: "Password must contain atleast one number"})
    .regex(/[@$%&*?]/, {message: "Password must contain atleast one character"})
})

export const AdminSigninInput = z.object({
    orgEmail: z.string(),
    password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters long"})
    .regex(/[A_Z]/, { message: "Password must contain atleast one uppercase"})
    .regex(/[a-z]/, { message: "Password must contain atleast one lowercase"})
    .regex(/\d/, { message: "Password must contain atleast one number"})
    .regex(/[@$%&*?]/, { message: "Password must contain atleast one character"})
})
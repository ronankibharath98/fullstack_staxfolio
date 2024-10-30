import { z } from "zod"

export const AdminSigninInput = z.object({
    orgName: z.string(),
    orgEmail: z.string(),
    password: z
    .string()
    .min(8, {message: "Password must be atleast 8 characters long"})
    .regex(/[A-Z]/, {message: "Password must contain atleast one uppercase"})
    .regex(/[a-z]/, {message: "Password must contain atleast one lowercase"})
    .regex(/\d/, {message: "Password must contain atleast one number"})
    .regex(/[@$%&*?]/, {message: "Password must contain atleast one character"})
})
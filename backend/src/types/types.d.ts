// types.d.ts
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    id?: string; // Add the custom `id` property
    email?: string; // Add the custom `id` property
    role?: string;
  }
}
import { z } from "zod";

export const authSchema = z.object({
    username: z
        .string()
        .min(5, "Username must be at least 5 characters.")
        .max(32, "Username must be at most 32 characters."),
    password: z
        .string()
        .min(4, "Password must be at least 4 characters.")
        .max(24, "Password must be at most 24 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
});
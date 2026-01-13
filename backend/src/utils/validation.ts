import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    role: z.enum(['READER', 'EDITOR', 'ADMIN']).optional(), // Optional for now, normally restricted
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

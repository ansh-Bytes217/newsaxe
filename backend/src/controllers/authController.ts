import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../utils/validation';
import prisma from '../utils/prisma';
import Logger from '../utils/logger';
import admin from '../utils/firebaseAdmin'; // Import firebase admin

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.flatten() });
            return;
        }

        const { email, password, name, role } = result.data;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'READER',
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        Logger.info(`User registered: ${user.email} (${user.role})`);

        // Generate Token
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ user, token });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.flatten() });
            return;
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        Logger.info(`User logged in: ${user.email}`);

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token: idToken } = req.body;
        if (!idToken) {
            res.status(400).json({ error: 'ID Token required' });
            return;
        }

        // Verify Firebase Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, uid } = decodedToken;

        if (!email) {
            res.status(400).json({ error: 'Google account missing email' });
            return;
        }

        // Find or Create User
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create user
            const dummyPassword = await bcrypt.hash(Math.random().toString(36) + uid, 10);

            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'User',
                    password: dummyPassword,
                    role: 'READER',
                }
            });
            Logger.info(`New user created via Google: ${email}`);
        } else {
            Logger.info(`User logged in via Google: ${email}`);
        }

        // Issue OUR Session Token
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        Logger.error('Google Auth Failed', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

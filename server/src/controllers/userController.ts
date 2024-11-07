import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login användare
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validera input
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Alla fält måste fyllas i' });
        }

        // Hitta användare
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Felaktig email eller lösenord' });
        }

        // Validera lösenord
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: 'Felaktig email eller lösenord' });
        }

        // Skapa JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'yourSecretKey',
            { expiresIn: '24h' }
        );

        // Sätt cookie och skicka respons
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 timmar
        });

        res.json({
            message: 'Inloggning lyckades',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Serverfel vid inloggning' });
    }
};

// Logga ut användare
export const logOutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token');
        res.json({ message: 'Utloggning lyckades' });
    } catch (error) {
        res.status(500).json({ message: 'Serverfel vid utloggning' });
    }
};

// Skapa ny användare
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Validera input
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: 'Alla fält måste fyllas i' });
        }

        // Kolla om användaren redan finns
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Email är redan registrerad' });
        }

        // Hasha lösenord
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Skapa ny användare
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        // Skapa token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'yourSecretKey',
            { expiresIn: '24h' }
        );

        // Sätt cookie och skicka respons
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: 'Användare skapad',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Serverfel vid registrering' });
    }
};

// Hämta alla användare
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Serverfel vid hämtning av användare',
        });
    }
};

// Uppdatera användare
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const updateData: {
            name?: string;
            email?: string;
            role?: string;
            password?: string;
        } = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
        }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Användare hittades inte' });
        }

        res.json({ message: 'Användare uppdaterad', user });
    } catch (error) {
        res.status(500).json({
            message: 'Serverfel vid uppdatering av användare',
        });
    }
};

// Ta bort användare
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'Användare hittades inte' });
        }

        res.json({ message: 'Användare borttagen' });
    } catch (error) {
        res.status(500).json({
            message: 'Serverfel vid borttagning av användare',
        });
    }
};

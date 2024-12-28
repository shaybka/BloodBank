import { JWT_SECRET } from '../config/config.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;
    
    
    if (!userName || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    
    try {
        // Check if user already exists
        const isUserExist = await User.findOne({
            $or: [
                { userName: userName.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        });

        if (isUserExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user with default role 'user'
        const userInfo = new User({ userName, email, password });
        await userInfo.save();

        // Generate JWT token with 'role'
        const token = jwt.sign({ _id: userInfo._id, role: userInfo.role }, JWT_SECRET, { expiresIn: '1h' });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Remove password from the response
        userInfo.password = undefined;

        res.status(201).json({
            message: 'User registered successfully',
            user: userInfo,
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`Something went wrong, please try again: ${error.message}`);
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        // Check if user exists
        const userInfo = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!userInfo) {
            return res.status(404).send('User not found');
        }

        // Check if password matches
        const isPasswordMatch = await userInfo.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(400).send('Invalid password');
        }

        const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds

        // Create JWT token with 'role'
        const token = jwt.sign({ _id: userInfo._id, role: userInfo.role }, JWT_SECRET, { expiresIn });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
            maxAge: expiresIn * 1000 // Convert to milliseconds
        });

        // Remove password from the response
        userInfo.password = undefined;

        res.status(200).send({
            message: 'Login successful',
            ...userInfo.toJSON(),
            expiresIn,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send(`Something went wrong, please try again: ${error.message}`);
    }
};

//  User to Admin
export const ToAdmin = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'User is already an admin.' });
        }

        // Update role to 'admin'
        user.role = 'admin';
        await user.save();

        res.status(200).json({
            message: 'User become to admin successfully.',
            user
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};
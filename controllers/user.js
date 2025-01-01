import { JWT_SECRET } from '../config/config.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    const { userName, email, password,role } = req.body;
    
    
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
        const userInfo = new User({ userName, email, password, role});
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
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const userInfo = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!userInfo) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        // Check if password matches
        const isPasswordMatch = await userInfo.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
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

        res.status(200).json({
            message: 'Login successful',
            ...userInfo.toJSON(),
            expiresIn,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Something went wrong, please try again: ${error.message}` });
    }
};

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { userName, email, role, password } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update fields if provided
        if (userName) {
            user.userName = userName.toLowerCase();
        }

        if (email) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email is already in use by another user.' });
            }
            user.email = email.toLowerCase();
        }

       
        if (role) {
            // if (req.user.role !== 'admin') {
            //     return res.status(403).json({ message: 'Forbidden: Only admins can update roles.' });
            // }
            const validRoles = ['user','hospital', 'admin'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: 'Invalid role specified.' });
            }
            user.role = role;
        }

        // Update password if provided
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
            }
            user.password = password;
        }

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: 'User updated successfully.',
            user
        });
    } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// get list of users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); 

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
          });
    } catch (error) {
        console.error(`Error fetching users: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
    }
};

export const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find and delete the user by ID
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'User deleted successfully.'
        });
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};
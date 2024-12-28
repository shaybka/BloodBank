import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import User from '../models/userModel.js'; 

// Middleware to authenticate token
export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(403).send('Invalid token');
        }
        
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(401).send('User not found');
        }
        req.user = user; // Contains user details including role
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send('Invalid token');
    }
};

// Middleware to authorize admin users
export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only.' });
    }
};
import express from "express";
const UserRouter = express.Router();
import { loginUser, registerUser, ToAdmin } from "../controllers/user.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/Authenticate.js";

// User Registration and Login
UserRouter.post("/register-user", registerUser);
UserRouter.post("/login-user", loginUser);

// Admin-Only Route to Promote Users
UserRouter.put("/promote/:userId", authenticateToken, authorizeAdmin, ToAdmin);

export default UserRouter;

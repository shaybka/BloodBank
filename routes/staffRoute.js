import express from "express";
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/Staff.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/Authenticate.js";

const StaffRouter = express.Router();

StaffRouter.post("/", authenticateToken, authorizeAdmin, createStaff);

StaffRouter.get("/", authenticateToken, getAllStaff);

StaffRouter.get("/:id", authenticateToken, getStaffById);

StaffRouter.put("/:id", authenticateToken, authorizeAdmin, updateStaff);

StaffRouter.delete("/:id", authenticateToken, authorizeAdmin, deleteStaff);

export default StaffRouter;

import express from "express";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,getRequestCount
} from "../controllers/Requests.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/Authenticate.js";

const RequestsRouter = express.Router();

RequestsRouter.post("/", authenticateToken, createRequest);
RequestsRouter.get('/count', authenticateToken, getRequestCount);

RequestsRouter.get("/", authenticateToken, getAllRequests);

RequestsRouter.get("/:id", authenticateToken, getRequestById);

RequestsRouter.put("/:id", authenticateToken, authorizeAdmin, updateRequest);

RequestsRouter.delete("/:id", authenticateToken, authorizeAdmin, deleteRequest);

export default RequestsRouter;
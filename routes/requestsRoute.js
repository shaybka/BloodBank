import express from "express";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
} from "../controllers/Requests.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/Authenticate.js";

const RequestsRouter = express.Router();


RequestsRouter.post("/", authenticateToken, createRequest);

RequestsRouter.get("/", authenticateToken, getAllRequests);

RequestsRouter.get("/:id", authenticateToken, getRequestById);


RequestsRouter.put(
  "/:id/status",
  authenticateToken,
  authorizeAdmin,
  updateRequestStatus
);


RequestsRouter.delete("/:id", authenticateToken, authorizeAdmin, deleteRequest);

export default RequestsRouter;

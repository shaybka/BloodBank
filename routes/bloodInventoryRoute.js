import express from 'express';
import {
    getAllBloodInventory,
    getBloodInventoryByType,
    createBloodInventory,
    getBloodInventoryCount,
    getBloodGroupCounts,
    updateBloodInventory,
    deleteBloodInventory
} from '../controllers/BloodInventory.js';
import { authenticateToken, authorizeAdmin } from '../middleware/Authenticate.js';

const BloodInventoryRouter = express.Router();

// Get All Blood Inventory
BloodInventoryRouter.get('/', authenticateToken, getAllBloodInventory);

// Get Blood Inventory by Blood Type
BloodInventoryRouter.get('/:bloodType', authenticateToken, getBloodInventoryByType);

// Create Blood Inventory (Admin Only)
BloodInventoryRouter.post('/', authenticateToken, createBloodInventory);

// Update Blood Inventory (Admin Only)
BloodInventoryRouter.put('/:id', authenticateToken, updateBloodInventory);

// Delete Blood Inventory (Admin Only)
BloodInventoryRouter.delete('/:id', authenticateToken, deleteBloodInventory);
BloodInventoryRouter.get('/count', authenticateToken, getBloodInventoryCount);
BloodInventoryRouter.get('/groups', authenticateToken, getBloodGroupCounts);
export default BloodInventoryRouter;
import express from 'express';
import {
    createDonor,
    getAllDonors,
    getDonorById,
    updateDonor,
    getAllDonationHistories,
    deleteDonor
} from '../controllers/Donor.js';
import { authenticateToken, authorizeAdmin } from '../middleware/Authenticate.js';

const DonorRouter = express.Router();


DonorRouter.put('/update/:id', authenticateToken, updateDonor);
DonorRouter.delete('/delete/:id', authenticateToken, deleteDonor);
DonorRouter.get('/donation-histories', authenticateToken, getAllDonationHistories);
DonorRouter.post('/', authenticateToken, createDonor); 
DonorRouter.get('/', authenticateToken, getAllDonors);
DonorRouter.get('/:id', authenticateToken, getDonorById);

export default DonorRouter;
import express from 'express';
import { makeDonation, getAllDonations, getDonationById } from '../controllers/Donation.js';
import { authenticateToken } from '../middleware/Authenticate.js';

const DonationRouter = express.Router();

// Make a Donation
DonationRouter.post('/', authenticateToken, makeDonation);

// Get All Donations
DonationRouter.get('/', authenticateToken, getAllDonations);

// Get Donation by ID
DonationRouter.get('/:id', authenticateToken, getDonationById);

export default DonationRouter;
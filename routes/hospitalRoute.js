import express from 'express';
import { registerHospital, updateHospital, deleteHospital, getAllHospitals, getHospitalById, checkDuplicateHospital } from '../controllers/Hospital.js';
import { authenticateToken, authorizeAdmin } from '../middleware/Authenticate.js';

const HospitalRouter = express.Router();

// Admin-Only Routes
HospitalRouter.post('/register', authenticateToken, authorizeAdmin, registerHospital);
HospitalRouter.put('/update/:id', authenticateToken, authorizeAdmin, updateHospital);
HospitalRouter.delete('/delete/:id', authenticateToken, authorizeAdmin, deleteHospital);
HospitalRouter.post('/check-duplicate', authenticateToken, authorizeAdmin, checkDuplicateHospital);

// Authenticated User Routes
HospitalRouter.get('/', authenticateToken, getAllHospitals);
HospitalRouter.get('/:id', authenticateToken, getHospitalById);

export default HospitalRouter;
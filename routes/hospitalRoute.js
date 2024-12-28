import express from 'express';
import { registerHospital, updateHospital,verifyHospital, deleteHospital, getAllHospitals, getHospitalById } from '../controllers/Hospital.js';
import { authenticateToken, authorizeAdmin } from '../middleware/Authenticate.js';

const HospitalRouter = express.Router();

// Admin-Only Routes
HospitalRouter.post('/register', authenticateToken, authorizeAdmin, registerHospital);
HospitalRouter.put('/update/:id', authenticateToken, authorizeAdmin, updateHospital);
HospitalRouter.delete('/delete/:id', authenticateToken, authorizeAdmin, deleteHospital);
HospitalRouter.put('/verify/:id', authenticateToken, authorizeAdmin, verifyHospital);

// Authenticated User Routes
HospitalRouter.get('/', authenticateToken, getAllHospitals);
HospitalRouter.get('/:id', authenticateToken, getHospitalById);

export default HospitalRouter;
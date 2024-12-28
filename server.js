import express from 'express';
import connectDB from './config/db.js';
import chalk from 'chalk';
import UserRouter from './routes/userRoute.js';
import HospitalRouter from './routes/hospitalRoute.js';
import cookieParser from 'cookie-parser';
import DonorRouter from './routes/donorRoute.js';
import DonationRouter from './routes/donationRoute.js';
import BloodInventoryRouter from './routes/bloodInventoryRoute.js'; 
import RequestsRouter from './routes/requestsRoute.js'; 
import StaffRouter from './routes/staffRoute.js'; 
const app = express();
const PORT = 8000;

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', UserRouter);
app.use('/api/hospital', HospitalRouter);
app.use('/api/donors', DonorRouter);
app.use('/api/donations', DonationRouter);
app.use('/api/blood-inventory', BloodInventoryRouter); 
app.use('/api/requests', RequestsRouter);
app.use('/api/staff', StaffRouter); 
// Connect to Database and Start Server
connectDB();
app.listen(PORT, () =>{
    console.log(`${chalk.green.bold('server')} is running on port ${PORT}`);
});

export default app;
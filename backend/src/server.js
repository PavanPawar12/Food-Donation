import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { getPlatformStats } from './controllers/statsController.js'

const app = express()

dotenv.config({path:'../.env'})

connectDB();
const PORT=8000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health
app.get('/api/health',(req, res)=>{
    res.json({ status: 'OK', message: 'ShareButes API is running', timestamp: new Date().toISOString() })
})

// Global platform stats
app.get('/api/stats', getPlatformStats)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/donations", donationRoutes)
app.use("/api/requests", requestRoutes)

// 404 fallback (no path to avoid path-to-regexp issues)
app.use((req, res) => {
    res.status(404).json({ success:false, message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

// server
app.listen(PORT,()=>{
    console.log(`App listning at:${PORT}`)
})
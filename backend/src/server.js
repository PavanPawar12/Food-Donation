import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import connectDB from './config/db.js'
import router from './routes/authRoutes.js'
import router1 from './routes/foodRoutes.js';
import router2 from './routes/ngoRoutes.js'
;

const app = express()

dotenv.config({path:'../.env'})

connectDB();
const PORT=8000
app.use(express.json());
app.use(cors());

app.get('/',(req, res)=>{
    res.send("Hello Pavan");
})
 // Routes
app.use("/api/auth", router)
app.use("/api/food", router1)
app.use("/api/ngo", router2)
 // server
app.listen(PORT,()=>{
    console.log(`App listning at:${PORT}`)
})
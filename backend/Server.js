import express, { json } from "express"
import dotenv from "dotenv"
import connectDB from "./Database/Connetion.js"
import adminroutes from "./Routes/AdminRoutes.js"
import cors from "cors"
import mentorroutes from "./Routes/MentorRoutes.js"

const app = express()




dotenv.config()

const port=process.env.PORT || 4001


app.use(cors({
    origin:["http://localhost:5173/","http://localhost:5173"],
    credentials: true
}))

app.use(express.json())


connectDB()

app.use("/admin",adminroutes)
app.use("/mentor",mentorroutes)

app.listen(port,()=>{
    console.log(`server is running in port : ${port}`);
    
})
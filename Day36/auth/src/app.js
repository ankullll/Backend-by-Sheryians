const express = require('express')
const cookieParser = require('cookie-parser')



const app = express()
app.use(express.json())
app.use(cookieParser())

// Routes
const authRoutes = require('../src/routes/auth.routes')
app.use('/api/auth',authRoutes)

app.get("/",(req,res)=>{
     res.status(200).json({message:"Auth service is running"})
})

module.exports = app;
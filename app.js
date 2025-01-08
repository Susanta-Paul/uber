const dotenv=require("dotenv")
dotenv.config()
const cors=require("cors")
const port= process.env.PORT || 3000
const express=require("express")
const app =express()
const connectToDB=require("./db/db")
connectToDB()
const cookieParser=require("cookie-parser")
const userRoutes=require("./routes/user.routes")
const captainRoutes=require("./routes/captain.routes")



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/user", userRoutes)
app.use("/captain", captainRoutes)

app.listen(port, ()=>{
    console.log(`server is running at port: ${port}`)
})
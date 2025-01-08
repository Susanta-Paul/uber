const blacklistTokenModels = require("../models/blacklistToken.models")
const captainModel=require("../models/captain.model")
const captainService=require("../services/captain.service")
const { validationResult }= require("express-validator")

module.exports.registerCaptain= async (req, res, next)=>{
    const errors =validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors})
    }

    const {fullname, email, password, vehicle}=req.body

    const isCaptain= await captainModel.findOne({email})

    if(isCaptain){
        res.status(400).json({"message": "Email already exists"})
    }

    const hashPassword=captainModel.hashPassword(password)

    const captain= await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    })

    const token=captainModel.generateAuthToken()

    res.status(201).json({token, captain})
}

module.exports.loginCaptain= async (req, res, next)=>{
    const errors =validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors})
    }

    const {email, password}=req.body

    const captain=await captainModel.findOne(email).select("+password")

    if(!captain){
        return res.status(401).json({"message": "Invalid email or password"})
    }

    const isMatch= captainModel.comparePassword(password)

    if(!isMatch){
        return res.status(401).json({"messsage": "Invalid email or Password"})
    }

    const token = captainModel.generateAuthToken()

    res.cookie("token", token)

    res.status(200).json(token, captain)
}

module.exports.captainProfile= async (req, res, next)=>{
    res.status(200).json(req.captain)
}

module.exports.logoutCaptain= async (req, res, next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

    await blacklistTokenModels.create({token})

    res.clearCookie("token")

    res.status(200).json({"message":"Successfully logout"})

}
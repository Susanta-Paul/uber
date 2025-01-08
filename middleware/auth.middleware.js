const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const blacklistTokenModel=require("../models/blacklistToken.models")
const captainModel = require("../models/captain.model")

module.exports.authUser= async (req, res, next)=>{
    const token=req.cookies.token || req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({"message": "Unauthorized"})
    }

    const isBlacklisted= await blacklistTokenModel.findOne({token: token})

    if(isBlacklisted){
        return res.status(401).json({"message": "Unauthorized"})
    }

    try{
        const decoded=jwt.verify(token, process.env.SECRET_KEY)
        const user= await userModel.findOne({_id: decoded._id})

        req.user=user
        return next()
    }
    catch{
        return res.status(401).json({"message": "Unauthorized"})
    }
}

module.exports.authCaptian= async (req, res, next)=>{
    const token= req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({"message": "Unauthorized"})
    }

    const isBlacklisted=await blacklistTokenModel.findOne(token)

    if(isBlacklisted){
        return res.status(401).json({"message": "Unauthorized"})
    }

    try{
        const decoded=jwt.verify(token)
        const captain=await captainModel.findById(decoded._id)

        req.captain=captain
        next()

    }catch{
        return res.status(401).json({"message": "Unauthorized"})
    }
}

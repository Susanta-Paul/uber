const userModel=require("../models/user.model");
const userService=require("../services/user.service")
const { validationResult }= require("express-validator")
const blacklistTokenModel=require("../models/blacklistToken.models")



module.exports.registerUser= async (req, res, next)=>{

    const error= validationResult(req)
    if (!error.isEmpty){
        return res.status(400).json({errors: error.array()})
    };

    const {fullname, email, password}=req.body

    const hashPassword=userModel.hashPassword(password);
    const user=userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword
    })
    const token= user.generateAuthToken()

    res.status(201).josn({"token": token, "user": user})
}

module.exports.loginUser=async (req, res, next)=>{
    const error= validationResult(req)
    if (!error.isEmpty){
        return res.status(400).json({errors: error.array()})
    };

    const {email, password}=req.body
    const user=userModel.findOne({email}).select('+password'); // also get the password
    if(!user){
        return res.status(401).json({"message": "Invalid email or password"})
    }

    const isMatch=await user.comparePassword(password)
    if(!isMatch){
        return res.status(401).json({"message": "Invalid email or password"})
    }
    const token= user.generateAuthToken();

    res.status(200).json({"token": token, "user": user})
}

module.exports.getUserProfile= async (req, res, next)=>{
    res.status(200).json(req.user)
    
}

module.exports.logoutUser= async (req, res, next)=>{
    res.clearCookie("token");

    const token=req.cookies.token || req.headers.authorization.split(" ")[1];

    await blacklistTokenModel.create({token})


    res.status(200).json({"message": "user successfully logout! "})
}
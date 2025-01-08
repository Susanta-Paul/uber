const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const captainSchema=new mongoose.Schema({
    fullname:{
        firstname: {
            type: String,
            required: true,
            minlength: [3, "firstname should be atleast 3 character long"]
        },
        lastname: {
            type: String,
            required: false,
            minlength: [3, "lastname should be atleast 3 character long"]
        },
    },
    email:{
        type: String,
        required: true,
        lower: true,
        minlength: [13, "email must be atleast 13 character long"]
    },
    password:{
        type: String,
        required: true,
        select: false    // this field will not automatically send when the models is get
    },
    socketId:{
        type: String,
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    vehicle:{
        color: {
            type: String,
            required: true,
            minlength: [3, "color should be atleast 3 character long"]
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, "plate should be atleast 3 character long"]
        },
        capacity:{
            type: Number,
            required: true,
            min: [1, "capacity must be atleast 1"]
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ["car", "motorcycle", "auto"]
        }
    },
    location: {
        lat: {
            type: Number
        },
        long: {
            type: Number
        }
    }
})

captainSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id: this._id}, process.env.SECRET_KEY, {expiresIn: "24h"})
    return token;
}

captainSchema.methods.comparePassword= async function(password){
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password, 10)
}

module.exports=mongoose.model("captain", captainSchema)
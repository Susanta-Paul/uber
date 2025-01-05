const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const userSchema= new mongoose.Schema({
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
    }
})

userSchema.methods.generateAuthToken= function(){
    const token= jwt.sign({_id: this._id}, process.env.SECRET_KEY)
    return token;
}

userSchema.methods.comparePassword= async function(password){
    const match=await bcrypt.compare(password, this.password)
    return match
}

userSchema.statics.hashPassword= async function(password){
    return await bcrypt.hash(password, 10)
}

const userModel=mongoose.model("user", userSchema)

module.exports=userModel;
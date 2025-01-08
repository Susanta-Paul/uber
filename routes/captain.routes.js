const express=require("express")
const router=express.Router()
const { body }=require("express-validator")
const captainController=require("../controllers/captain.controller")
const authMiddleware=require("../middleware/auth.middleware")



router.post("/register",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname").isLength({min: 3}).withMessage("Firstname must be atleast 3 character long"),
    body("password").isLength({min:6}).withMessage("password must be 6 character long"),
    body("vehicle.color").isLength({min:3}).withMessage("vehicle color must be atleast 3 character long"),
    body("vehicle.plate").isLength({min:3}).withMessage("vehicle plate must be atleast 3 character long"),
    body("vehicle.capacity").isInt({min:1}).withMessage("vehicle capacity must be atleast 1 character long"),
    body("vehicle.vehicleType").isIn(["car", "motorcycle", "auto"]).withMessage("Invalid vehicle type"),
],
    captainController.registerCaptain
)


router.post("/login",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({min: 6}).withMessage("password must be 6 character long")
],
    captainController.loginCaptain
)

router.get("/profile", authMiddleware.authCaptian,captainController.captainProfile)
router.get("/logout", authMiddleware.authCaptian, captainController.logoutCaptain)

module.exports=router
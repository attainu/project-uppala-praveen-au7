const router = require('express').Router()
const signupValidate = require("../validation/signupValidation")
const signup = require("../controller/signup")

router.get('/',(req,res,next)=>{
    res.sendFile()
})

router.post('/',signupValidate,signup.createUser)

module.exports = router
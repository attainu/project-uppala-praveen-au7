const router = require('express').Router()
const loginValidate = require("../validation/loginValidation")
const login  = require("../controller/login")
 
router.get('/',(req,res,next)=>{
    res.sendFile()
})

router.post('/',loginValidate,login.authenticate)

module.exports = router 
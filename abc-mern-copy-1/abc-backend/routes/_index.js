const router =  require("express").Router()



const signup =  require('./signup')
const login = require('./login')
const logout = require('./logout')
const register = require("./registerUser")
const verifyEmail = require("./verifyEmail")
const resetPassword = require("./resetPassword")

router.use('/signup',signup)
router.use('/login',login)
router.use('/logout',logout)
router.use('/register',register)
router.use('/verifyEmail',verifyEmail)
router.use('/resetPassword',resetPassword)

module.exports = router
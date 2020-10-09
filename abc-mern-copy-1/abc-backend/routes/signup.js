const signUpRouter = require('express').Router()


const signupValidate =  require('../validation/signup') 
const { createEmailVerificationLink } = require("../controller/signup")
const {sendEmailVerificationLink} = require("../emails/account")

signUpRouter.post('/',signupValidate,createEmailVerificationLink,sendEmailVerificationLink)

module.exports = signUpRouter
const verifyEmailRouter = require("express").Router()
const {createEmailVerificationLink} = require("../controller/signup")
const {sendResetPasswordLink} = require("../emails/account")

verifyEmailRouter.post('/',createEmailVerificationLink,sendResetPasswordLink)

module.exports = verifyEmailRouter
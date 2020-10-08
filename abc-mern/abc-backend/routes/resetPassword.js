const resetPasswordRouter = require("express").Router()
const {resetPasswordTokenVerify} = require("../middlewares/authorization")
const resetPassword = require("../controller/resetPassword")

resetPasswordRouter.patch('/',resetPasswordTokenVerify,resetPassword)

module.exports = resetPasswordRouter
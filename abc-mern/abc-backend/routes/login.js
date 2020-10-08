const loginRouter = require('express').Router()
const loginValidate = require("../validation/login")
const login = require("../controller/login") 
const {createLoginToken} = require("../middlewares/authorization") 
const contacts = require("../middlewares/fetchingContacts")



loginRouter.post('/',loginValidate,login.authenticate,createLoginToken,contacts.fetchAll)

module.exports = loginRouter
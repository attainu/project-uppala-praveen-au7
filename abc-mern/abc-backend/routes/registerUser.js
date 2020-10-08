const registerUserRouter = require("express").Router()
const {createUser} = require("../controller/signup")
const {emailTokenVerify} = require("../middlewares/authorization")

registerUserRouter.post('/',emailTokenVerify,createUser)

module.exports = registerUserRouter
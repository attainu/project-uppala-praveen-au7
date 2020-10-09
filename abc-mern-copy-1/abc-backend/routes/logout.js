const router = require('express').Router()
const {createLogoutToken,tokenVerify} = require('../middlewares/authorization')

router.patch('/',tokenVerify,createLogoutToken)

module.exports = router
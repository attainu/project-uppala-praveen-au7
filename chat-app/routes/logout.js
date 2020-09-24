const router = require('express').Router()
const {createLogoutToken} = require('../middlewares/authorization')
router.use('/',createLogoutToken)

module.exports = router
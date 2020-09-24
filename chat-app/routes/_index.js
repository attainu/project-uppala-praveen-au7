const router = require('express').Router()

const signup = require('./signup')
const login = require('./login')
const logout = require('./logout')

router.use('/signup',signup)
router.use('/login',login)
router.use('/logout',logout)

module.exports = router
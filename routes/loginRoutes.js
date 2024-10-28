const express = require('express')
const login = require('../controllers/loginController')

const loginRouter = express.Router()

loginRouter.route('/').post(login)

module.exports = loginRouter

const express = require('express')
const app = express()

app.use(express.json())

const routeUser = require('./routes/user')

routeUser(app)

module.exports = app
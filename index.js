const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('combined'))

const routeUser = require('./routes/user')

routeUser(app)

app.listen(3000, () => console.log('Servidor de pé: http://localhost:3000'))

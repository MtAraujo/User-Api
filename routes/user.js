const express = require('express')
const { getAll, create, getOne, Put, Remove } = require('../controller/user')
const {validateByID, validateDuplicatedEmail, validateCreate, validateErrorUser, paramsID} = require('../middleware/user')
const app = express()
app.use(express.json())

module.exports = (app) => {
    app.get('/user', getAll)

    app.post('/user', validateCreate, validateErrorUser, validateDuplicatedEmail, create)

    app.get('/user/:id', paramsID, validateErrorUser, validateByID, getOne)

    app.put('/user/:id', paramsID, validateErrorUser, validateCreate, validateErrorUser, validateByID, Put)

    app.delete('/user/:id', paramsID, validateErrorUser, validateByID, Remove)
}
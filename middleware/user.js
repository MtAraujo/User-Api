const { body, validationResult, param } = require('express-validator')
const { getUserEmail, getOneUser } = require('../model/user')
const { ObjectId } = require('mongodb')

exports.paramsID = [
  param('id')
    .notEmpty()
    .custom((value) => ObjectId.isValid(value)),
]

exports.validateCreate = [
  body('name').trim().notEmpty().isString(),
  body('email').trim().notEmpty().isEmail(),
]

exports.validateErrorUser = (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    return next()
  } catch (error) {
    return res.status(500).json({message: 'Erro não esperado!'})
  }
  
}

exports.validateDuplicatedEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    const { data } = await getUserEmail(email)
  
    if (data) {
      return res.status(400).json({ message: 'Cadastro Duplicado!' })
    }
  
    return next()
  } catch (error) {
    return res.status(500).json({message: 'Erro não esperado!'})
  }
  
}

exports.validateByID = async (req, res, next) => {
  try {
    const { id } = req.params
    const { data } = await getOneUser(id)
  
    if (!data) {
      return res.status(404).json({ message: 'Usuário não encontrado!' })
    }
    return next()
  } catch (error) {
        return res.status(500).json({message: 'Erro não esperado!'})
  }
 
}

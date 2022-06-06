const { getAllUser, getOneUser, createUser, putUser, deleteUser  } = require('../model/user')

exports.getAll = async(req, res) => {
    try{
        let {limit = 10, page = 0} = req.query
        const {data: retorno, status} = await getAllUser(Number(page), Number(limit))
        return res.status(status).json(retorno)
    }catch(error){
        return res.status(500).json({message: 'Erro não esperado!'})
    }
    
}

exports.create = async(req, res) => {
    try{
        const {data: retorno, status} = await createUser(req.body)
        res.status(status).json(retorno)
    }catch{
        return res.status(500).json({message: 'Erro não esperado!'})
    }
}

exports.getOne = async(req, res) => {     
    try{
        const {data: retorno, status} = await  getOneUser(req.params.id)
        res.status(status).json(retorno)
    }catch{
        return res.status(500).json({message: 'Erro não esperado!'})
    }
}

exports.Put = async(req, res) => {
    try{
        const {data: retorno, status} = await putUser(req.params.id, req.body)
        res.status(status).json(retorno)
    }catch{
        return res.status(500).json({message: 'Erro não esperado!'})
    }
    
}

exports.Remove = async(req, res) => {
    try{
        const {data: retorno, status} = await deleteUser(req.params.id)
        res.status(status).json(retorno)
    }catch{
        return res.status(500).json({message: 'Erro não esperado!'})
    }
}
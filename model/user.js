const { ObjectId } = require('mongodb')
const { connectMongodb } = require('../database/connect')
const { getDataRedis, setDataRedis } = require('../database/redis')

const keyPrimary = 'users'

exports.getAllUser = async (page, limit) => {

    const key = `users - page: ${page} - limit: ${limit}`
    const response = await getDataRedis(keyPrimary, key)
    
    if(response){
        return {data: response, status: 200}
    }

    const {collection} = await connectMongodb('aula', 'users')
    const skip = page > 0 ? page * limit : 0
    const [data] = await collection.aggregate(
        [
            {
                $facet: {
                    metaData: [{$count: 'total'}, {$addFields: { page }}],
                    data: [{$skip: skip}, {$limit: limit}]
                }
            }
        ]
    ).toArray()

    await setDataRedis(keyPrimary, key, data)

    return { data, status: 200} 
}

exports.createUser = async ({ name, email }) => {
    const {collection} = await connectMongodb('aula', 'users')
    const {insertedId} = await collection.insertOne({name, email})
    return { data: {_id: insertedId, name, email}, status: 201}
}

exports.getOneUser = async (id) => {

    const key = `users - id: ${id}`
    const result = await getDataRedis(keyPrimary, key)

    if(result){
        return {data: result, status: 200}
    }

    const {collection} = await connectMongodb('aula', 'users')
    const data = await collection.findOne({ _id: ObjectId(id) })

    await setDataRedis(keyPrimary, key, data)
    
    return { data, status: 200}
}

exports.putUser = async (id, { name, email }) => {

    const {collection} = await connectMongodb('aula', 'users')
    const data = await collection.updateOne({ _id: ObjectId(id) }, {$set: { name, email}})

    return { data: { _id: id, name, email }, status: 221}
}

exports.deleteUser = async (id) => {
    const {collection} = await connectMongodb('aula', 'users')
    const data = await collection.findOne({ _id: ObjectId(id) })
    await collection.deleteOne({ _id: ObjectId(id) })
    return { data, status: 221}
}

exports.getUserEmail = async (email) => {

    const key = `users - email: ${email}`
    const result = await client.getDataRedis(keyPrimary, key)

    if(result){
        return {data: JSON.parse(result), status: 200}
    }
    
    const {collection} = await connectMongodb('aula', 'users')
    const data = await collection.findOne({ email })

    await client.setDataRedis(keyPrimary, key, data)

    return {data, status: 200}
}

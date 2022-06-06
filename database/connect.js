const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'

const client = new MongoClient(url);

let connect = null

const retry = 5

const sleep = (timing) => new Promise((resolve) =>
    setTimeout(() => { resolve()}, timing)
)

const retryConnection = async (dbName, collection, tryN = 1) => {
    
    try{
        if (connect === null) {
            await client.connect();
            await client.db("admin").command({ping: 1})
            connect = client.db(dbName)
        }
        if (connect != null){
            await connect.command({ping: 1})
        }
    
        return {
            collection: connect.collection(collection),
        }
    }catch (error){
        connect = null
        if(tryN > retry) {
            throw new Error(error.message)
        }
        await sleep(1000)
        return retryConnection(dbName, collection, tryN + 1)
    }
}

exports.connectMongodb = async (dbName, collection) => {
    return retryConnection(dbName, collection)
}
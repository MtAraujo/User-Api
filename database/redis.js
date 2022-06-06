const { createClient } = require('redis')
var retryStrategy = require("node-redis-retry-strategy");

let client
let timeout = null

const TimeOut = () => {
    timeout = setTimeout(() => {
        connectRedis()
    }, 10000)
}

const connectRedis = async () => {
    client = createClient({
        socket: {
            reconnectStrategy: retryStrategy({
                delay_of_retry_attempts: 1000
            })
        }
    });

    client.on('connect', function () {
        clearTimeout(timeout)
        console.log('connected!')
    });

    client.on('end', function () {
        client = null
        TimeOut()
        console.log('connection with redis has been closed')
    });

    client.on('reconnecting', function () {
        clearTimeout(timeout)
        console.log('reconnecting!')
    });

    client.on('error', () => {
        client = null
    });
    try {
        await client.connect()
        await client.ping()
    } catch (error) {
        return null
    }

}

exports.getDataRedis = async (keyPrimary, key) => {
    try {
        const client = await connectRedis()
        const result = await client.hGetAll(keyPrimary)
        await client.disconnect()
        if (result && result[key]) {
            return JSON.parse(result[key])
        }
    } catch (error) {
        return null
    }

}

exports.setDataRedis = async (keyPrimary, key, data) => {
    try {
        const client = await connectRedis()
        await client.hSet(keyPrimary, key, JSON.stringify(data))
        await client.disconnect()
        return true
    } catch (error) {
        return false
    }
}

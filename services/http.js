const axios = require('axios')

exports.IntegrationHTTP = async (url, method, body = null) => {
    try{
        const {data, status} = await axios ({ url, method, data: body})
        return { data, status}
    } catch (error){
        const { data, status } = error.response
        return { data, status }
    }
}
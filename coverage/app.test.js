const request = require('supertest')
const app = require('../app')
const { faker } = require('@faker-js/faker');
const { ObjectId } = require('mongodb');
const { connectMongodb } = require('../database/connect')

const randomName = faker.name.findName();
const randomEmail = faker.internet.email();

let idCreated = null

const id = new ObjectId()

const _id = String(id)

const agent = request.agent(app);

beforeAll(async() =>{
    const collection = await connectMongodb('aula', 'users')
    const { insertedId } = await collection.insertOne({name: randomName, email: randomEmail})
    idCreated = insertedId
})

afterAll(async() =>{
    const collection = await connectMongodb('aula', 'users')
    await collection.deleteMany({})
})

test('request GET - /user expected to status 200.', async () => {
    const result = await agent.get('/user')
    expect(result.statusCode).toBe(200)
    expect(true).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(1)
    expect(result.body).toEqual(
        expect.arrayContaining([{_id: String(idCreated), name: randomName, email: randomEmail}])
    )
})

test('request GET - /user/a expected to status 400.', async () => {
    const result = await agent.get('/user/a')
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors).toEqual([
            {
                "location": "params", 
                "msg": "Invalid value", 
                "param": "id", 
                "value": "a"
            }
    ])
})

test('request GET - /user/625fa26b8c58a65e141b0749 expected to status 404.', async () => {
    const result = await agent.get('/user/625fa26b8c58a65e141b0740')
    expect(result.statusCode).toBe(404)
    expect(false).toBe(Array.isArray(result.body.errors))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual(undefined)
})

test('request POST - /user in body null expected to status 400.', async () => {
    const result = await agent.post('/user').send(null)
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "name", 
            "value": ""
        }, 
        {
            "location": "body",
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        }, 
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        }
    ])
})

test('request POST - /user in email invalid expected to status 400.', async () => {
    const result = await agent.post('/user').send({name: randomName, email: 'matheusaraujo.com.br'})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": "matheusaraujo.com.br"
        }
    ])
})

test('request POST - /user in name invalid expected to status 400.', async () => {
    const result = await agent.post('/user').send({name: '', email: randomEmail})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "name", 
            "value": ""
        }
    ])
})

test('request POST - /user in name and email invalid expected to status 400.', async () => {
    const result = await agent.post('/user').send({name: ' ', email: ' '})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "name", 
            "value": ""
        },
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        },
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        }
    ])
})

test('request POST - /user in name is a number expected to status 400.', async () => {
    const result = await agent.post('/user').send({name: 1, email: randomEmail})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual(undefined)
})

test('request POST - /user in email is a number expected to status 400.', async () => {
    const result = await agent.post('/user').send({name: randomName, email: 1})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": "1"
        }
    ])
})

test('request POST - /user in name and email are numbers expected to status 400.', async () => {
    const result = await agent.post('/user').send({name: 1, email: 1})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": "1"
        }
    ])
})

test('request PUT - /user/id name and email are numbers expected to status 400.', async () => {
    const result = await agent.put(`/user/${idCreated}`).send({name: 1, email: 1})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": "1"
        }
    ])
})

test('request PUT - /user/625fa26b8c58a65e141b0aaa name and email valid, id nonexistent expected to status 404.', async () => {
    const result = await agent.put('/user/625fa26b8c58a65e141b0aaa').send({name: randomName, email: randomEmail})
    expect(result.statusCode).toBe(404)
    expect(false).toBe(Array.isArray(result.body.errors))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual(undefined)
})

test('request PUT - /user/id name invalid expected to status 400.', async () => {
    const result = await agent.put(`/user/${idCreated}`).send({name: ' ', email: randomEmail})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "name", 
            "value": ""
        }
    ])
})

test('request PUT - /user/id email invalid expected to status 400.', async () => {
    const result = await agent.put(`/user/${idCreated}`).send({name: randomName, email: ' '})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        }, 
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        }
    ])
})

test('request PUT - /user/id email is a number expected to status 400.', async () => {
    const result = await agent.put(`/user/${idCreated}`).send({name: randomName, email: 1})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": "1"
        }
    ])
})

// test('request PUT - /user/id name is a number expected to status 400.', async () => {
//     const result = await agent.put(`/user/${idCreated}`).send({name: 1, email: randomEmail})
//     expect(result.statusCode).toBe(400)
//     expect(true).toBe(Array.isArray(result.body))
//     expect(result.body.length).toBe(undefined)
//     expect(result.body.errors).toEqual(undefined)
// })

test('request PUT - /user/id body null expected to status 400.', async () => {
    const result = await agent.put(`/user/${idCreated}`).send(null)
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "name", 
            "value": ""
        },
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        },
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        }
    ])
})

test('request PUT - /user/id name and email invalid expected to status 400.', async () => {
    const result = await agent.put(`/user/${idCreated}`).send({name: ' ', email: ' '})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "name", 
            "value": ""
        },
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        },
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        }
    ])
})

test('request PUT - /user/id name is missing expected to status 400.', async () => {
    const result = await agent.put(`/user/${idCreated}`).send({email: randomEmail})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "name", 
            "value": ""
        }
    ])
})

test('request PUT - /user/id email is missing expected to status 400.', async () => {
    const result = await agent.put(`/user/${idCreated}`).send({name: randomName})
    expect(result.statusCode).toBe(400)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        },
        {
            "location": "body", 
            "msg": "Invalid value", 
            "param": "email", 
            "value": ""
        }
    ])
})

test('request DELETE - /user/62602cadcff03ec1fd7ae901 id nonexistent expected to status 404.', async () => {
    const result = await agent.delete('/user/62602cadcff03ec1fd7ae901')
    expect(result.statusCode).toBe(404)
    expect(false).toBe(Array.isArray(result.body.errors))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual(undefined)
})

test('request DELETE - id valid expected to status 221.', async () => {
    const result = await agent.delete(`/user/${idCreated}`)
    expect(result.statusCode).toBe(221)
    expect(false).toBe(Array.isArray(result.body))
    expect(result.body.length).toBe(undefined)
    expect(result.body).toEqual(
        expect.objectContaining({_id: String(idCreated), name: randomName, email: randomEmail})
    )
})

test('request DELETE - /user/a id invalid expected to status 400.', async () => {
    const result = await agent.delete('/user/a')
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.length).toBe(undefined)
    expect(result.body.errors).toEqual([
        {
            "location": "params", 
            "msg": "Invalid value", 
            "param": "id", 
            "value": "a"
        }
    ])
})




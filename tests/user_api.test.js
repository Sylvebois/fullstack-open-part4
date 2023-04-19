const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { USERS } = require('./testData')
const User = require('../models/user')

beforeEach(async () => { 
  await User.deleteMany({})

  const saltRounds = 10
  const passHash = await bcrypt.hash(USERS[0].password, saltRounds)

  const defaultUser = new User({username: USERS[0].username, name: USERS[0].name, passHash })
  await defaultUser.save()
})

describe('User creation checks', () => {
  test('When all is OK returns 201 and data + added to db', async () => {
    const user = {
      username: 'testing',
      name: 'test',
      password: 'testPassword'
    }

    const response = await api
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(user)
      .expect(201)

    expect(response.body.id).toBeDefined()

    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(USERS.length + 1)
  })

  test('Error 400 when missing username', async () => {
    const user = {
      name: 'test',
      password: 'test'
    }

    const response = await api
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(user)
      .expect(400)
  })

  test('Error 400 when missing password', async () => {
    const user = {
      name: 'test',
      username: 'testing'
    }

    const response = await api
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(user)
      .expect(400)
  })

  test('Error 400 when missing name', async () => {
    const user = {
      username: 'testing',
      password: 'test'
    }

    const response = await api
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(user)
      .expect(400)
  })

  test('Error 400 and explicit message when username is already taken', async () => {
    const user = {
      username: 'root',
      name:'root',
      password: 'test'
    }

    const response = await api
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(user)
      .expect(400)

    console.log(response)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
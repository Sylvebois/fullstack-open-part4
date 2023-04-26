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

  const defaultUser = new User({ username: USERS[0].username, name: USERS[0].name, passHash })
  await defaultUser.save()
})

describe('Wrong or missing data on login', () => {
  test('Error 401 when missing username', async () => {
    const user = { password: 'testingPass' }

    const response = await api
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('invalid username or password')
  })

  test('Error 401 when missing password', async () => {
    const user = { username: 'root' }

    const response = await api
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('invalid username or password')

  })

  test('Error 401 when invalid username', async () => {
    const user = { username: 'rooting', password: 'salainen' }

    const response = await api
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('invalid username or password')
  })

  test('Error 401 when invalid password', async () => {
    const user = { username: 'root', password: 'xxxxxxx' }

    const response = await api
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('invalid username or password')
  })
})

test('Status 200 + return token and user data when valid', async () => {
  const user = { username: 'root', password: 'salainen' }

  const response = await api
    .post('/api/login')
    .set('Accept', 'application/json')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.token).toBeDefined()
  expect(response.body.username).toBeDefined()
  expect(response.body.name).toBeDefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})

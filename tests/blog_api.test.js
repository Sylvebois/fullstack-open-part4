const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { BLOGS, USERS } = require('./testData')
const Blog = require('../models/blog')
const User = require('../models/user')

let defaultUser = null

beforeAll(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passHash = await bcrypt.hash(USERS[0].password, saltRounds)
  const user = new User({ username: USERS[0].username, name: USERS[0].name, passHash })
  const createdUser = await user.save()

  const result = await api
    .post('/api/login')
    .set('Accept', 'application/json')
    .send({ username: USERS[0].username, password: USERS[0].password })

  defaultUser = result.body
  defaultUser.id = createdUser._id.toString()
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogsObj = BLOGS.map(blog => new Blog({ ...blog, user: defaultUser.id }))
  const savePromises = blogsObj.map(blog => blog.save())

  await Promise.all(savePromises)
})

describe('Group of Blogs reading checks', () => {
  test('Get a list of all blogs', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(BLOGS.length)
  })

  test('Check if unique identifier is id', async () => {
    const response = await api.get('/api/blogs/5a422a851b54a676234d17f7')
    expect(response.body.id).toBeDefined()
  })
})

describe('Blog reading checks', () => {
  test('Return the right blog', async () => {
    const blog = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: defaultUser.id
    }

    const response = await api.get('/api/blogs/5a422a851b54a676234d17f7')
    expect(response.body).toEqual(blog)
  })

  test('Error 404 on unknow id', async () => {
    await api
      .get('/api/blogs/5a422a851b54a676234d17f0')
      .set('Accept', 'application/json')
      .send({ likes: 2 })
      .expect(404)
  })

  test('Error 400 on invalid id', async () => {
    await api
      .get('/api/blogs/wrongId')
      .set('Accept', 'application/json')
      .send({ likes: 2 })
      .expect(400)
  })
})

describe('Blog update checks', () => {
  test('Return the updated blog', async () => {
    const awaitedData = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 2,
      user: defaultUser.id
    }

    const response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .set({ 'Authorization': `Bearer ${defaultUser.token}`, 'Accept': 'application/json' })
      .send({ likes: 2 })

    expect(response.body).toEqual(awaitedData)
  })

  test('Error 404 on unknow id', async () => {
    await api
      .put('/api/blogs/5a422a851b54a676234d17f0')
      .expect(404)
  })

  test('Error 400 on invalid id', async () => {
    await api
      .put('/api/blogs/wrongId')
      .expect(400)
  })
})

describe('Blog deletion checks', () => {
  test('Return 204 on valid id', async () => {
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .set({ 'Authorization': `Bearer ${defaultUser.token}`, 'Accept': 'application/json' })
      .expect(204)
  })

  test('Error 404 on unknow id', async () => {
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f0')
      .set({ 'Authorization': `Bearer ${defaultUser.token}` })
      .expect(404)
  })

  test('Error 400 on invalid id', async () => {
    await api
      .delete('/api/blogs/wrongId')
      .set({ 'Authorization': `Bearer ${defaultUser.token}` })
      .expect(400)
  })
})

describe('Blog creation checks', () => {
  test('Check if blog is added to MongoDB', async () => {
    const blogData = {
      title: 'The normal data for a post',
      author: 'Me',
      url: 'http://localhost:3003',
      likes: 1
    }

    const blog = new Blog(blogData)
    await blog.save()

    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map(data => data.title)

    expect(blogTitles).toHaveLength(BLOGS.length + 1)
    expect(blogTitles).toContain(blogData.title)
  })

  test('Likes defaulted to 0', async () => {
    const blog = new Blog({
      title: 'The missing likes data for a post',
      author: 'Me',
      url: 'http://localhost:3003'
    })
    const response = await blog.save()

    expect(response).toHaveProperty('likes')
    expect(response.likes).toBe(0)
  })

  test('Error 400 when missing title', async () => {
    const blog = new Blog({
      author: 'Unknown author',
      url: 'http://localhost:3003',
      likes: 13
    })

    await api
      .post('/api/blogs')
      .send(blog)
      .set({ 'Authorization': `Bearer ${defaultUser.token}`, 'Accept': 'application/json' })
      .expect(400)
  })

  test('Error 400 when missing url', async () => {
    const blog = new Blog({
      title: 'The missing url for a post',
      author: 'Test',
      likes: 13
    })

    await api
      .post('/api/blogs')
      .send(blog)
      .set({ 'Authorization': `Bearer ${defaultUser.token}`, 'Accept': 'application/json' })
      .expect(400)
  })

  test('Error 401 when missing token', async () => {
    const blog = new Blog({
      title: 'The missing likes data for a post',
      author: 'Me',
      url: 'http://localhost:3003'
    })

    await api
      .post('/api/blogs')
      .send(blog)
      .set('Accept', 'application/json')
      .expect(401)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
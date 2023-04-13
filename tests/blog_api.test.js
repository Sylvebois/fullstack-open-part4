const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const BLOGS = require('./testData')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogsObj = BLOGS.map(blog => new Blog(blog))
  const savePromises = blogsObj.map(blog => blog.save())

  await Promise.all(savePromises)
})

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

describe('Blog creation checks', () => {
  test('Check if blog is added to MongoDB', async () => {
    const blogData = {
      title: 'The lorem ipsum of life',
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
      title: 'The lorem ipsum of life',
      author: 'Me',
      url: 'http://localhost:3003'
    })
    const response = await blog.save()

    expect(response).toHaveProperty('likes')
    expect(response.likes).toBe(0)
  })

  test('Error 400 when missing title', async () => {
    const blog = new Blog({
      author: 'Test',
      url: 'http://localhost:3003',
      likes: 13
    })
    const response = await blog.save()

    expect(response.status).toBe(400)
  })

  test('Error 400 when missing url', async () => {
    const blog = new Blog({
      title: 'The lorem ipsum of life',
      author: 'Test',
      likes: 13
    })
    const response = await blog.save()

    expect(response.status).toBe(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
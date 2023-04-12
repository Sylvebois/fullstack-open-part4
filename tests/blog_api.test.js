const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const BLOGS = require('./testData')
const Blog = require('../models/blog')
const helper = require('./blog_test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogsObj = BLOGS.map(blog => new Blog(blog))
  const savePromises = blogsObj.map(blog => blog.save())

  await Promise.all(savePromises);
})

test('Get a list of all blogs', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(BLOGS.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
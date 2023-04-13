const blogsRouter = require('express').Router()
require('express-async-error')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  blog ?
    response.json(blog) :
    response.status(404).end()
})

blogsRouter.post('/', async (request, response) => {
  if (request.body.title && request.body.url) {
    const blog = new Blog(request.body)
    const result = await blog.save()

    response.status(201).json(result)
  }
  else {
    response.status(400).json({ error: 'Missing title or url' })
  }
})

/* TO-DO : Add error handling */

module.exports = blogsRouter
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

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  
  try {
    const result = await blog.save()
    response.status(201).json(result)
  }
  catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
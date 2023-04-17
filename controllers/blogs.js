const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    blog ?
      response.json(blog) :
      response.status(404).end()
  }
  catch (err) {
    next(err)
  }
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

blogsRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body
  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true }
    )

    result ?
      response.json(result) :
      response.status(404).end()
  }
  catch (err) {
    next(err)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndRemove(request.params.id)
    result ?
      response.status(204).end() :
      response.status(404).end()
  }
  catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
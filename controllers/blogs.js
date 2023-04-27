const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })

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

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const blog = new Blog(request.body)
  const user = request.user

  try {
    if (!user) {
      response.status(404).json({ error: 'User not found' })
    }
    else {
      blog.user = user._id

      const result = await blog.save()

      user.blogs = user.blogs.concat(result.id)
      await user.save()

      response.status(201).json(result)
    }
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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (!blog) {
      response.status(404).end()
    }
    else if (!user) {
      response.status(404).json({ error: 'User not found' })
    }
    else if (blog.user.toString() !== user._id.toString()) {
      response.status(401).json({ error: 'User not allowed to delete this blog' })
    }
    else {
      await Blog.deleteOne({ _id: blog._id })
      response.status(204).end()
    }
  }
  catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
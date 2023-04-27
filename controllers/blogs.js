const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

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

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      response.status(401).json({ error: 'Invalid token' })
    }
    else {
      const users = await User.findById(decodedToken.id)
      blog.user = users._id

      const result = await blog.save()

      users.blogs = users.blogs.concat(result.id)
      await users.save()

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

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!blog) {
      response.status(404).end()
    }
    else if (!decodedToken.id) {
      response.status(401).json({ error: 'Invalid token' })
    }
    else if (blog.user.toString() !== decodedToken.id.toString()) {
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
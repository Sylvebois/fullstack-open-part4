const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { likes: 0 })
  response.json(users)
})

userRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id)
    user ?
      response.json(user) :
      response.status(404).end()
  }
  catch (err) {
    next(err)
  }
})

userRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (password && password.length > 5) {
    const saltRounds = 10
    const passHash = await bcrypt.hash(password, saltRounds)

    const user = new User({ username, name, passHash })

    try {
      const savedUser = await user.save()
      response.status(201).json(savedUser)
    }
    catch (err) {
      next(err)
    }
  }
  else {
    response.status(400).json({ error: 'password minimal length is 6 chars.' })
  }
})

userRouter.delete('/:id', async (request, response, next) => {
  try {
    const result = await User.findByIdAndRemove(request.params.id)
    result ?
      response.status(204).end() :
      response.status(404).end()
  }
  catch (err) {
    next(err)
  }
})

module.exports = userRouter
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passOK = (user === null || !password) ?
    false :
    await bcrypt.compare(password, user.passHash)

  if (!user || !passOK) {
    response.status(401).json({ error: 'invalid username or password' })
  }
  else {
    const userForToken = {
      username: user.username,
      id: user._id
    }

    const token = await jwt.sign(userForToken, process.env.SECRET)

    response
      .status(200)
      .send({ token, username: user.username, name: user.name })
  }
})

module.exports = loginRouter

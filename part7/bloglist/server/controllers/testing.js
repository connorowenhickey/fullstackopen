const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  if (process.env.NODE_ENV !== 'test') {
    return response.status(403).json({
      error: 'reset only allowed in test environment'
    })
  }

  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
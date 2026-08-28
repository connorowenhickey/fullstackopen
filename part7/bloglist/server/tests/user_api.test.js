const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('username must be at least 3 characters long', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'secret',
  }

  await api.post('/api/users').send(newUser).expect(400)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, 0)
})

test('password must be at least 3 characters long', async () => {
  const newUser = {
    username: 'connor',
    name: 'Connor',
    password: 'ab',
  }

  await api.post('/api/users').send(newUser).expect(400)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, 0)
})

test('username is required', async () => {
  const newUser = {
    name: 'No Username',
    password: 'secret',
  }

  await api.post('/api/users').send(newUser).expect(400)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, 0)
})

test('password is required', async () => {
  const newUser = {
    username: 'connor',
    name: 'No Password',
  }

  await api.post('/api/users').send(newUser).expect(400)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, 0)
})

test('username must be unique', async () => {
  const firstUser = {
    username: 'connor',
    name: 'Connor',
    password: 'secret',
  }

  await api.post('/api/users').send(firstUser).expect(201)

  const duplicateUser = {
    username: 'connor',
    name: 'Another Connor',
    password: 'anothersecret',
  }

  await api.post('/api/users').send(duplicateUser).expect(400)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, 1)
})

after(async () => {
  await mongoose.connection.close()
})

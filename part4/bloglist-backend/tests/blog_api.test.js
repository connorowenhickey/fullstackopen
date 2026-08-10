const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Test Author',
    url: 'https://example.com/html',
    likes: 5,
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Another Author',
    url: 'https://example.com/javascript',
    likes: 10,
  },
]

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('test123', 10)

  const user = new User({
    username: 'Connor123',
    name: 'Connor',
    passwordHash,
  })

  const savedUser = await user.save()

  const blogsWithUser = initialBlogs.map((blog) => ({
    ...blog,
    user: savedUser._id,
  }))

  const savedBlogs = await Blog.insertMany(blogsWithUser)

  savedUser.blogs = savedBlogs.map((blog) => blog._id)
  await savedUser.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'Connor123',
      password: 'test123',
    })

  token = loginResponse.body.token
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

test('the unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Learning automated backend testing',
    author: 'Connor Hickey',
    url: 'https://example.com/backend-testing',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length + 1
  )

  const titles = response.body.map((blog) => blog.title)

  assert(titles.includes(newBlog.title))
})

test('likes defaults to zero when missing', async () => {
  const newBlog = {
    title: 'A blog without likes',
    author: 'Connor Hickey',
    url: 'https://example.com/no-likes',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('a blog without a title is not added', async () => {
  const newBlog = {
    author: 'Connor Hickey',
    url: 'https://example.com/missing-title',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

test('a blog without a url is not added', async () => {
  const newBlog = {
    title: 'A blog without a URL',
    author: 'Connor Hickey',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    initialBlogs.length - 1
  )

  const ids = blogsAtEnd.body.map((blog) => blog.id)

  assert(!ids.includes(blogToDelete.id))
})

test('the likes of a blog can be increased', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedBlog = {
    likes: blogToUpdate.likes + 1,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(
    response.body.likes,
    blogToUpdate.likes + 1
  )

  const blogsAtEnd = await api.get('/api/blogs')

  const blogInDatabase = blogsAtEnd.body.find(
    (blog) => blog.id === blogToUpdate.id
  )

  assert.strictEqual(
    blogInDatabase.likes,
    blogToUpdate.likes + 1
  )
})

test('the likes of a blog can be decreased', async () => {
  const blogsAtStart = await api.get('/api/blogs')

  const blogToUpdate = blogsAtStart.body.find(
    (blog) => blog.likes > 0
  )

  assert(blogToUpdate)

  const updatedBlog = {
    likes: blogToUpdate.likes - 1,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(
    response.body.likes,
    blogToUpdate.likes - 1
  )

  const blogsAtEnd = await api.get('/api/blogs')

  const blogInDatabase = blogsAtEnd.body.find(
    (blog) => blog.id === blogToUpdate.id
  )

  assert.strictEqual(
    blogInDatabase.likes,
    blogToUpdate.likes - 1
  )
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized blog',
    author: 'Someone',
    url: 'https://example.com/unauthorized',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

after(async () => {
  await mongoose.connection.close()
})
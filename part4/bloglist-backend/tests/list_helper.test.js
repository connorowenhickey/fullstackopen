const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'First blog',
      author: 'Author One',
      url: 'https://example.com/first',
      likes: 5,
    },
    {
      title: 'Second blog',
      author: 'Author Two',
      url: 'https://example.com/second',
      likes: 12,
    },
    {
      title: 'Third blog',
      author: 'Author Three',
      url: 'https://example.com/third',
      likes: 8,
    },
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    const expected = {
      title: 'Second blog',
      author: 'Author Two',
      url: 'https://example.com/second',
      likes: 12,
    }

    assert.deepStrictEqual(result, expected)
  })

  test('with one blog, returns that blog', () => {
    const oneBlog = [blogs[0]]

    const result = listHelper.favoriteBlog(oneBlog)

    assert.deepStrictEqual(result, blogs[0])
  })

  test('with an empty list, returns null', () => {
    const result = listHelper.favoriteBlog([])

    assert.strictEqual(result, null)
  })
})

describe('author with most blogs', () => {
  const blogs = [
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      url: 'https://example.com/clean-code',
      likes: 10,
    },
    {
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      url: 'https://example.com/clean-architecture',
      likes: 8,
    },
    {
      title: 'Agile Software Development',
      author: 'Robert C. Martin',
      url: 'https://example.com/agile',
      likes: 6,
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/dijkstra',
      likes: 17,
    },
  ]

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('returns null for an empty list', () => {
    const result = listHelper.mostBlogs([])

    assert.strictEqual(result, null)
  })
})

describe('author with most likes', () => {
  const blogs = [
    {
      title: 'First Robert blog',
      author: 'Robert C. Martin',
      url: 'https://example.com/robert-one',
      likes: 5,
    },
    {
      title: 'Dijkstra blog',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/dijkstra',
      likes: 17,
    },
    {
      title: 'Second Robert blog',
      author: 'Robert C. Martin',
      url: 'https://example.com/robert-two',
      likes: 8,
    },
  ]

  test('returns the author with the most total likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('returns null for an empty list', () => {
    const result = listHelper.mostLikes([])

    assert.strictEqual(result, null)
  })
})
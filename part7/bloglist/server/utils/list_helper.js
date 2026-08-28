const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const reducer = (favorite, blog) => {
    if (blog.likes > favorite.likes) {
      return blog
    }

    return favorite
  }

  return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  const authors = Object.entries(blogCounts)

  const topAuthor = authors.reduce((most, current) => {
    return current[1] > most[1] ? current : most
  })

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = blogs.reduce((totals, blog) => {
    totals[blog.author] = (totals[blog.author] || 0) + blog.likes

    return totals
  }, {})

  const authors = Object.entries(likesByAuthor)

  const topAuthor = authors.reduce((most, current) => {
    return current[1] > most[1] ? current : most
  })

  return {
    author: topAuthor[0],
    likes: topAuthor[1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}

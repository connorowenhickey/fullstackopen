import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from 'react-router-dom'
import {
  TextField,
  Button,
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography
} from '@mui/material'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBlogappUser'
    )

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)

      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)

      setUser(loggedUser)
      setUsername('')
      setPassword('')

      navigate('/')
    } catch (exception) {
      setNotification({
        text:
          exception.response?.data?.error ||
          'Wrong username or password',
        type: 'error'
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')

    setUser(null)

    navigate('/')
  }

  const createBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)

      setBlogs(currentBlogs =>
        currentBlogs.concat(addedBlog)
      )

      setNotification({
        text: `A new blog ${addedBlog.title} by ${addedBlog.author} added`,
        type: 'success'
      })

      navigate('/')

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({
        text: 'Error: blog could not be added',
        type: 'error'
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    const returnedBlog = await blogService.update(
      blog.id,
      updatedBlog
    )

    setBlogs(currentBlogs =>
      currentBlogs.map(b =>
        b.id !== blog.id
          ? b
          : { ...returnedBlog, user: blog.user }
      )
    )
  }

  const removeBlog = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!confirmed) {
      return
    }

    try {
      await blogService.remove(blog.id)

      setBlogs(currentBlogs =>
        currentBlogs.filter(b => b.id !== blog.id)
      )

      navigate('/')
    } catch {
      setNotification({
        text: 'Error: blog could not be removed',
        type: 'error'
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const loginForm = (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        login
      </Typography>

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400
        }}
      >
        <TextField
          label="username"
          value={username}
          onChange={({ target }) =>
            setUsername(target.value)
          }
        />

        <TextField
          label="password"
          type="password"
          value={password}
          onChange={({ target }) =>
            setPassword(target.value)
          }
        />

        <Button
          type="submit"
          variant="contained"
        >
          login
        </Button>
      </Box>
    </Box>
  )

  const blogList = (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        blogs
      </Typography>

      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map(blog =>
          <Box
            key={blog.id}
            sx={{ mb: 1 }}
          >
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </Box>
        )}
    </Box>
  )

  const navButtonStyle = {
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.3)'
    }
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={navButtonStyle}
          >
            blogs
          </Button>

          {user === null &&
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={navButtonStyle}
            >
              login
            </Button>
          }

          {user !== null &&
            <>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={navButtonStyle}
              >
                create new
              </Button>

              <Box
                sx={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography>
                  {user.name} logged in
                </Typography>

                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={navButtonStyle}
                >
                  logout
                </Button>
              </Box>
            </>
          }
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/login"
          element={loginForm}
        />

        <Route
          path="/create"
          element={
            user
              ? <BlogForm createBlog={createBlog} />
              : null
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              handleLike={() => likeBlog(blog)}
              handleRemove={() => removeBlog(blog)}
              user={user}
            />
          }
        />

        <Route
          path="/"
          element={blogList}
        />
      </Routes>
    </Container>
  )
}

export default App
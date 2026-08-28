import { useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import {
  TextField,
  Button,
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import User from './components/User'
import Users from './components/Users'
import NotFound from './components/NotFound'

import blogService from './services/blogs'
import loginService from './services/login'
import persistentUser from './services/persistentUser'

import useField from './hooks/useField'

import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'

const App = () => {
  const username = useField('text')
  const password = useField('password')

  const user = useUserStore((state) => state.user)

  const setUser = useUserStore((state) => state.setUser)

  const clearUser = useUserStore((state) => state.clearUser)

  const blogs = useBlogStore((state) => state.blogs)

  const initializeBlogs = useBlogStore(
    (state) => state.initializeBlogs,
  )

  const addBlog = useBlogStore(
    (state) => state.addBlog,
  )

  const updateBlog = useBlogStore(
    (state) => state.updateBlog,
  )

  const removeBlogFromStore = useBlogStore(
    (state) => state.removeBlog,
  )

  const notification = useNotificationStore(
    (state) => state.notification,
  )

  const setNotification = useNotificationStore(
    (state) => state.setNotification,
  )

  const clearNotification = useNotificationStore(
    (state) => state.clearNotification,
  )

  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      initializeBlogs(blogs)
    })
  }, [initializeBlogs])

  useEffect(() => {
    const loggedUser = persistentUser.getUser()

    if (loggedUser) {
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [setUser])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username: username.input.value,
        password: password.input.value,
      })

      persistentUser.saveUser(loggedUser)

      blogService.setToken(loggedUser.token)

      setUser(loggedUser)

      username.reset()
      password.reset()

      navigate('/')
    } catch (exception) {
      setNotification({
        text:
          exception.response?.data?.error ||
          'Wrong username or password',
        type: 'error',
      })

      setTimeout(() => {
        clearNotification()
      }, 5000)
    }
  }

  const handleLogout = () => {
    persistentUser.removeUser()

    clearUser()

    navigate('/')
  }

  const createBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)

      addBlog(addedBlog)

      setNotification({
        text: `A new blog ${addedBlog.title} by ${addedBlog.author} added`,
        type: 'success',
      })

      navigate('/')

      setTimeout(() => {
        clearNotification()
      }, 5000)
    } catch {
      setNotification({
        text: 'Error: blog could not be added',
        type: 'error',
      })

      setTimeout(() => {
        clearNotification()
      }, 5000)
    }
  }

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    const returnedBlog = await blogService.update(
      blog.id,
      updatedBlog,
    )

    updateBlog({
      ...returnedBlog,
      user: blog.user,
    })
  }

  const addComment = async (blog, comment) => {
    const returnedBlog = await blogService.addComment(
      blog.id,
      comment,
    )

    updateBlog({
      ...returnedBlog,
      user: blog.user,
    })
  }

  const removeBlog = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await blogService.remove(blog.id)

      removeBlogFromStore(blog.id)

      navigate('/')
    } catch {
      setNotification({
        text: 'Error: blog could not be removed',
        type: 'error',
      })

      setTimeout(() => {
        clearNotification()
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
          maxWidth: 400,
        }}
      >
        <TextField
          label="username"
          {...username.input}
        />

        <TextField
          label="password"
          {...password.input}
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
        .map((blog) => (
          <Box key={blog.id} sx={{ mb: 1 }}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </Box>
        ))}
    </Box>
  )

  const navButtonStyle = {
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.3)',
    },
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

          <Button
            color="inherit"
            component={Link}
            to="/users"
            sx={navButtonStyle}
          >
            users
          </Button>

          {user === null && (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={navButtonStyle}
            >
              login
            </Button>
          )}

          {user !== null && (
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
                  gap: 1,
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
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <ErrorBoundary>
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
              blog ? (
                <Blog
                  blog={blog}
                  handleLike={() => likeBlog(blog)}
                  handleRemove={() => removeBlog(blog)}
                  handleComment={(comment) =>
                    addComment(blog, comment)
                  }
                  user={user}
                />
              ) : (
                <NotFound />
              )
            }
          />

          <Route
            path="/users"
            element={<Users />}
          />

          <Route
            path="/users/:id"
            element={<User />}
          />

          <Route
            path="/"
            element={blogList}
          />

          <Route
            path="*"
            element={<h2>Page not found</h2>}
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
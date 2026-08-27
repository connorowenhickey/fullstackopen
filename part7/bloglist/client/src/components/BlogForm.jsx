import { useState } from 'react'
import {
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2 }}
      >
        create new
      </Typography>

      <Box
        component="form"
        onSubmit={addBlog}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400
        }}
      >
        <TextField
          label="title"
          value={title}
          onChange={({ target }) =>
            setTitle(target.value)
          }
        />

        <TextField
          label="author"
          value={author}
          onChange={({ target }) =>
            setAuthor(target.value)
          }
        />

        <TextField
          label="url"
          value={url}
          onChange={({ target }) =>
            setUrl(target.value)
          }
        />

        <Button
          type="submit"
          variant="contained"
        >
          create
        </Button>
      </Box>
    </Box>
  )
}

export default BlogForm
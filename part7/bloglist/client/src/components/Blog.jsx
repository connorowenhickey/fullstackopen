import {
  Box,
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'

import useField from '../hooks/useField'

const Blog = ({
  blog,
  handleLike,
  handleRemove,
  handleComment,
  user,
}) => {
  const comment = useField('text')

  if (!blog) {
    return null
  }

  const submitComment = async (event) => {
    event.preventDefault()

    await handleComment(comment.input.value)

    comment.reset()
  }

  const canRemove =
    user &&
    blog.user &&
    (blog.user.username === user.username ||
      blog.user.id === user.id)

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4">
        {blog.title} {blog.author}
      </Typography>

      <div>
        <a href={blog.url}>
          {blog.url}
        </a>
      </div>

      <div>
        {blog.likes} likes{' '}
        <Button
          variant="contained"
          size="small"
          onClick={handleLike}
        >
          like
        </Button>
      </div>

      <div>
        added by {blog.user?.name}
      </div>

      {canRemove && (
        <Button
          variant="contained"
          color="error"
          onClick={handleRemove}
          sx={{ mt: 1 }}
        >
          remove
        </Button>
      )}

      <Typography
        variant="h5"
        sx={{ mt: 3 }}
      >
        comments
      </Typography>

      <Box
        component="form"
        onSubmit={submitComment}
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
          mb: 2,
          maxWidth: 600,
        }}
      >
        <TextField
          label="add a comment"
          size="small"
          fullWidth
          {...comment.input}
        />

        <Button
          type="submit"
          variant="contained"
        >
          comment
        </Button>
      </Box>

      {blog.comments?.length > 0 ? (
        <List>
          {blog.comments.map((comment, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'list-item',
                listStyleType: 'disc',
                ml: 4,
              }}
            >
              {comment}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{ mt: 2 }}>
          no comments
        </Typography>
      )}
    </Box>
  )
}

export default Blog
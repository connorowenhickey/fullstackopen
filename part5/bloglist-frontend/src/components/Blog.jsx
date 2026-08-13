import {
  Paper,
  Typography,
  Button,
  Stack,
  Link
} from '@mui/material'

const Blog = ({
  blog,
  handleLike,
  handleRemove,
  user
}) => {
  if (!blog) {
    return null
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        marginTop: 3,
        maxWidth: 700
      }}
    >
      <Typography
        variant="h4"
        sx={{ marginBottom: 2 }}
      >
        {blog.title} {blog.author}
      </Typography>

      <Stack spacing={2}>
        <Link
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {blog.url}
        </Link>

        <Typography>
          likes {blog.likes}
        </Typography>

        {user &&
          <Button
            variant="contained"
            onClick={handleLike}
            sx={{ alignSelf: 'flex-start' }}
          >
            like
          </Button>
        }

        <Typography>
          added by {blog.user?.name}
        </Typography>

        {blog.user?.username === user?.username &&
          <Button
            variant="outlined"
            onClick={handleRemove}
            sx={{ alignSelf: 'flex-start' }}
          >
            remove
          </Button>
        }
      </Stack>
    </Paper>
  )
}

export default Blog
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material'

import userService from '../services/users'

const User = () => {
  const [users, setUsers] = useState([])
  const { id } = useParams()

  useEffect(() => {
    userService.getAll().then((users) => {
      setUsers(users)
    })
  }, [])

  const user = users.find((user) => user.id === id)

  if (!user) {
    return null
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          maxWidth: 700,
        }}
      >
        <Typography variant="h4">
          {user.name}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          @{user.username}
        </Typography>

        <Typography
          variant="h5"
          sx={{ mt: 3 }}
        >
          added blogs
        </Typography>

        <List>
          {user.blogs.map((blog) => (
            <ListItem
              key={blog.id}
              sx={{
                display: 'list-item',
                listStyleType: 'disc',
                ml: 4,
              }}
            >
              {blog.title}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default User
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then((users) => {
      setUsers(users)
    })
  }, [])

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        users
      </Typography>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>name</strong>
              </TableCell>
              <TableCell>
                <strong>username</strong>
              </TableCell>
              <TableCell>
                <strong>blogs created</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </TableCell>

                <TableCell>
                  {user.username}
                </TableCell>

                <TableCell>
                  {user.blogs.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

export default Users
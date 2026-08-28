import { Box, Typography } from '@mui/material'

const NotFound = () => {
  return (
    <Box
      sx={{
        mt: 5,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4">
        Page not found
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        The page you requested does not exist.
      </Typography>
    </Box>
  )
}

export default NotFound
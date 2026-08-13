require('dotenv').config()

if (
  process.env.NODE_ENV === 'test' &&
  process.env.TEST_MONGODB_URI === process.env.MONGODB_URI
) {
  throw new Error(
    'TEST_MONGODB_URI must not be the same as MONGODB_URI'
  )
}

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  PORT,
  MONGODB_URI,
}
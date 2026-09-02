require('dotenv').config({ quiet: true })

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const User = require('./models/user')

mongoose.set('strictQuery', false)

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('connected to MongoDB')

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },

      context: async ({ req }) => {
        const auth = req.headers.authorization

        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          )

          const currentUser = await User.findById(
            decodedToken.id
          ).exec()

          return { currentUser }
        }

        return {}
      },
    })

    console.log(`Server ready at ${url}`)
  } catch (error) {
    console.log('error starting server:', error.message)
  }
}

start()
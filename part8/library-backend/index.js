require('dotenv').config({ quiet: true })

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const express = require('express')
const cors = require('cors')
const http = require('http')

const { ApolloServer } = require('@apollo/server')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')

const {
  expressMiddleware,
} = require('@as-integrations/express5')

const {
  makeExecutableSchema,
} = require('@graphql-tools/schema')

const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const User = require('./models/user')

mongoose.set('strictQuery', false)

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('connected to MongoDB')

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    })

    const app = express()

    const httpServer = http.createServer(app)

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    })

    const serverCleanup = useServer(
      {
        schema,
      },
      wsServer
    )

    const server = new ApolloServer({
      schema,

      plugins: [
        ApolloServerPluginDrainHttpServer({
          httpServer,
        }),

        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose()
              },
            }
          },
        },
      ],
    })

    await server.start()

    app.use(
      '/',
      cors(),
      express.json(),

      expressMiddleware(server, {
        context: async ({ req }) => {
          const auth = req.headers.authorization

          if (
            auth &&
            auth.startsWith('Bearer ')
          ) {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.JWT_SECRET
            )

            const currentUser =
              await User.findById(
                decodedToken.id
              ).exec()

            return { currentUser }
          }

          return {}
        },
      })
    )

    httpServer.listen(4000, () => {
      console.log(
        'Server ready at http://localhost:4000'
      )

      console.log(
        'Subscriptions ready at ws://localhost:4000/graphql'
      )
    })
  } catch (error) {
    console.log(
      'error starting server:',
      error.message
    )
  }
}

start()
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => {
      return await Book.countDocuments({})
    },

    authorCount: async () => {
      return await Author.countDocuments({})
    },

    allBooks: async (_root, args) => {
      const filter = {}

      if (args.genre) {
        filter.genres = args.genre
      }

      if (args.author) {
        const author = await Author.findOne({
          name: args.author,
        }).exec()

        if (!author) {
          return []
        }

        filter.author = author._id
      }

      return await Book.find(filter)
        .populate('author')
        .exec()
    },

    allAuthors: async () => {
      return await Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'books',
          },
        },
        {
          $addFields: {
            bookCount: {
              $size: '$books',
            },
            id: {
              $toString: '$_id',
            },
          },
        },
        {
          $project: {
            books: 0,
          },
        },
      ]).exec()
    },

    me: (_root, _args, context) => {
      return context.currentUser
    },
  },

  Mutation: {
    addBook: async (_root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        let author = await Author.findOne({
          name: args.author,
        }).exec()

        if (!author) {
          author = new Author({
            name: args.author,
          })

          await author.save()
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        })

        await book.save()
        await book.populate('author')

        pubsub.publish('BOOK_ADDED', {
          bookAdded: book,
        })

        return book
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error: error.message,
          },
        })
      }
    },

    editAuthor: async (_root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const author = await Author.findOne({
        name: args.name,
      }).exec()

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        return await author.save()
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error: error.message,
          },
        })
      }
    },

    createUser: async (_root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error: error.message,
          },
        })
      }

      return user
    },

    login: async (_root, args) => {
      const user = await User.findOne({
        username: args.username,
      }).exec()

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: jwt.sign(
          userForToken,
          process.env.JWT_SECRET
        ),
      }
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError(
          '_resetDatabase is only available in test mode'
        )
      }

      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})

      return true
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () =>
        pubsub.asyncIterableIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
import { useState } from 'react'
import {
  useApolloClient,
  useSubscription,
} from '@apollo/client/react'

import { BOOK_ADDED, ALL_BOOKS } from './queries'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

const App = () => {
  const [page, setPage] = useState('authors')

  const [token, setToken] = useState(
    localStorage.getItem('library-user-token')
  )

  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const dataInStore = client.readQuery({
      query: ALL_BOOKS,
    })

    if (!dataInStore) {
      return
    }

    const alreadyIncluded = dataInStore.allBooks
      .map((book) => book.id)
      .includes(addedBook.id)

    if (!alreadyIncluded) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          allBooks: dataInStore.allBooks.concat(addedBook),
        },
      })
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')

    client.resetStore()

    setPage('authors')
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded

      console.log('SUBSCRIPTION RECEIVED:', addedBook)

      window.alert(
        `${addedBook.title} by ${addedBook.author.name} added`
      )

      updateCacheWith(addedBook)
    },
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>
          authors
        </button>

        <button onClick={() => setPage('books')}>
          books
        </button>

        {token && (
          <>
            <button onClick={() => setPage('add')}>
              add book
            </button>

            <button onClick={() => setPage('recommend')}>
              recommend
            </button>
          </>
        )}

        {!token ? (
          <button onClick={() => setPage('login')}>
            login
          </button>
        ) : (
          <button onClick={logout}>
            logout
          </button>
        )}
      </div>

      <Authors 
        show={page === 'authors'} 
        token={token}
      />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommendations show={page === 'recommend'} />

      {page === 'login' && (
        <LoginForm
          setToken={setToken}
          setPage={setPage}
        />
      )}
    </div>
  )
}

export default App
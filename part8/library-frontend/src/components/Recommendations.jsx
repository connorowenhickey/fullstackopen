import { useQuery } from '@apollo/client/react'
import { ME, BOOKS_BY_GENRE } from '../queries'

const Recommendations = ({ show }) => {
  const meResult = useQuery(ME, {
    skip: !show,
    fetchPolicy: 'network-only',
  })

  const favoriteGenre = meResult.data?.me?.favoriteGenre

  const booksResult = useQuery(BOOKS_BY_GENRE, {
    variables: {
      genre: favoriteGenre,
    },
    skip: !show || !favoriteGenre,
    fetchPolicy: 'network-only',
  })

  if (!show) {
    return null
  }

  if (meResult.loading) {
    return <div>loading...</div>
  }

  if (meResult.error) {
    return <div>Error: {meResult.error.message}</div>
  }

  if (booksResult.loading) {
    return <div>loading...</div>
  }

  if (booksResult.error) {
    return <div>Error: {booksResult.error.message}</div>
  }

  const books = booksResult.data?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>

      <p>books in your favorite genre</p>
      <strong>{favoriteGenre}</strong>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
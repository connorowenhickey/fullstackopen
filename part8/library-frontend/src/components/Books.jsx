import { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client/react'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)

  const allBooksResult = useQuery(ALL_BOOKS)

  const [getBooksByGenre, genreResult] =
  useLazyQuery(BOOKS_BY_GENRE, {
    fetchPolicy: 'network-only',
  })

  if (!show) {
    return null
  }

  if (allBooksResult.loading) {
    return <div>loading...</div>
  }

  if (allBooksResult.error) {
    return <div>Error: {allBooksResult.error.message}</div>
  }

  const allBooks = allBooksResult.data.allBooks

  const genres = [
    ...new Set(
      allBooks.flatMap((book) => book.genres)
    ),
  ]

  const selectGenre = (selectedGenre) => {
    setGenre(selectedGenre)

    getBooksByGenre({
      variables: {
        genre: selectedGenre,
      },
    })
  }

  const booksToShow = genre
    ? genreResult.data?.allBooks || []
    : allBooks

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {booksToShow.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((bookGenre) => (
          <button
            key={bookGenre}
            onClick={() => selectGenre(bookGenre)}
          >
            {bookGenre}
          </button>
        ))}

        <button
          onClick={() => setGenre(null)}
        >
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
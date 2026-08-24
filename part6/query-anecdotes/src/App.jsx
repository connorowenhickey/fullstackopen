import useAnecdotes from './hooks/useAnecdotes'

const App = () => {
  const {
    anecdotes,
    isPending,
    isError,
    addAnecdote,
    vote
  } = useAnecdotes()

  const handleSubmit = event => {
    event.preventDefault()

    const content = event.target.anecdote.value
    event.target.reset()

    addAnecdote(content)
  }

  if (isPending) {
    return <div>loading...</div>
  }

  if (isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  return (
    <div>
      <h3>Anecdotes</h3>

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>

          <div>
            has {anecdote.votes} votes

            <button onClick={() => vote(anecdote)}>
              vote
            </button>
          </div>
        </div>
      ))}

      <h3>create new</h3>

      <form onSubmit={handleSubmit}>
        <input name="anecdote" />
        <button type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default App
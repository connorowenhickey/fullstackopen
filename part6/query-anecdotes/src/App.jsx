import useAnecdotes from './hooks/useAnecdotes'
import useNotify from './hooks/useNotify'
import Notification from './components/Notification'

const App = () => {
  const {
    anecdotes,
    isPending,
    isError,
    addAnecdote,
    vote
  } = useAnecdotes()

  const { notify } = useNotify()

  const handleSubmit = event => {
    event.preventDefault()

    const content = event.target.anecdote.value
    event.target.reset()

    addAnecdote(content, {
      onSuccess: () => {
        notify(`anecdote '${content}' created`)
      },

      onError: () => {
        notify('too short anecdote, must have length 5 or more')
      }
    })
  }

  const handleVote = anecdote => {
    vote(anecdote)

    notify(`you voted '${anecdote.content}'`)
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

      <Notification />

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>

          <div>
            has {anecdote.votes} votes

            <button onClick={() => handleVote(anecdote)}>
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
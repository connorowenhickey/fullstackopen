import { useAnecdoteActions } from '../store'
import anecdoteService from '../services/anecdotes'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const setNotification = useNotificationActions()

  const addAnecdote = async event => {
    event.preventDefault()

    const content = event.target.anecdote.value

    const newAnecdote = await anecdoteService.createNew(content)

    add(newAnecdote)

    setNotification(`you created '${content}'`)

    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
import {
  useAnecdotes,
  useFilter,
  useAnecdoteActions
} from '../store'

import anecdoteService from '../services/anecdotes'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()

  const { update, remove } = useAnecdoteActions()
  const setNotification = useNotificationActions()

  const anecdotesToShow = anecdotes
    .filter(anecdote =>
      anecdote.content
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
    .toSorted((a, b) => b.votes - a.votes)

  const vote = async anecdote => {
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const returnedAnecdote =
      await anecdoteService.update(changedAnecdote)

    update(returnedAnecdote)

    setNotification(`you voted '${anecdote.content}'`)
  }

  const deleteAnecdote = async anecdote => {
    await anecdoteService.remove(anecdote.id)

    remove(anecdote.id)
  }

  return (
    <div>
      {anecdotesToShow.map(anecdote => (
        <div
          key={anecdote.id}
          data-testid="anecdote"
        >
          <div>
            {anecdote.content}
          </div>

          <div>
            has {anecdote.votes}

            <button onClick={() => vote(anecdote)}>
              vote
            </button>

            {anecdote.votes === 0 && (
              <button onClick={() => deleteAnecdote(anecdote)}>
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
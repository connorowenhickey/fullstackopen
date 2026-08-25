import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  filter: '',

  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()

      set(() => ({
        anecdotes
      }))
    },

    add: anecdote =>
      set(state => ({
        anecdotes: state.anecdotes.concat(anecdote)
      })),

    update: updatedAnecdote =>
      set(state => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === updatedAnecdote.id
            ? updatedAnecdote
            : anecdote
        )
      })),

    remove: id =>
      set(state => ({
        anecdotes: state.anecdotes.filter(
          anecdote => anecdote.id !== id
        )
      })),

    setFilter: value =>
      set(() => ({
        filter: value
      }))
  }
}))

export const useAnecdotes = () =>
  useAnecdoteStore(state => state.anecdotes)

export const useFilter = () =>
  useAnecdoteStore(state => state.filter)

export const useAnecdoteActions = () =>
  useAnecdoteStore(state => state.actions)

export default useAnecdoteStore
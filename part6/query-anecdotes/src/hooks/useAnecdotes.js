import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote
} from '../requests'

const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['anecdotes']
      })
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['anecdotes']
      })
    }
  })

  const addAnecdote = content => {
    newAnecdoteMutation.mutate({
      content,
      votes: 0
    })
  }

  const vote = anecdote => {
    updateAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote,
    vote
  }
}

export default useAnecdotes
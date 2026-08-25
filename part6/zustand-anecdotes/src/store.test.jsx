import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor
} from '@testing-library/react'

import useAnecdoteStore from './store'
import anecdoteService from './services/anecdotes'
import AnecdoteList from './components/AnecdoteList'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [],
    filter: ''
  })

  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe('anecdote store', () => {
  it('initializes anecdotes returned by backend', async () => {
    const mockAnecdotes = [
      {
        id: '1',
        content: 'Test anecdote',
        votes: 0
      },
      {
        id: '2',
        content: 'Another test anecdote',
        votes: 3
      }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    await useAnecdoteStore
      .getState()
      .actions
      .initialize()

    expect(
      useAnecdoteStore.getState().anecdotes
    ).toEqual(mockAnecdotes)
  })
})

describe('AnecdoteList', () => {
  it('displays anecdotes sorted by votes', () => {
    const anecdotes = [
      {
        id: '1',
        content: 'First',
        votes: 2
      },
      {
        id: '2',
        content: 'Second',
        votes: 10
      },
      {
        id: '3',
        content: 'Third',
        votes: 5
      }
    ]

    useAnecdoteStore.setState({
      anecdotes,
      filter: ''
    })

    render(<AnecdoteList />)

    const renderedAnecdotes =
      screen.getAllByTestId('anecdote')

    expect(renderedAnecdotes[0].textContent)
      .toContain('Second')

    expect(renderedAnecdotes[1].textContent)
      .toContain('Third')

    expect(renderedAnecdotes[2].textContent)
      .toContain('First')
  })

  it('displays only anecdotes matching the filter', () => {
    const anecdotes = [
      {
        id: '1',
        content: 'React is great',
        votes: 2
      },
      {
        id: '2',
        content: 'Zustand is simple',
        votes: 5
      },
      {
        id: '3',
        content: 'Learning React hooks',
        votes: 1
      }
    ]

    useAnecdoteStore.setState({
      anecdotes,
      filter: 'react'
    })

    render(<AnecdoteList />)

    expect(
      screen.getByText('React is great')
    ).toBeTruthy()

    expect(
      screen.getByText('Learning React hooks')
    ).toBeTruthy()

    expect(
      screen.queryByText('Zustand is simple')
    ).toBeNull()
  })

  it('voting increases the number of votes', async () => {
    const anecdote = {
      id: '1',
      content: 'Test voting',
      votes: 0
    }

    useAnecdoteStore.setState({
      anecdotes: [anecdote],
      filter: ''
    })

    anecdoteService.update.mockImplementation(
      async anecdote => anecdote
    )

    render(<AnecdoteList />)

    fireEvent.click(
      screen.getByRole('button', { name: 'vote' })
    )

    await waitFor(() => {
      expect(
        useAnecdoteStore.getState().anecdotes[0].votes
      ).toBe(1)
    })
  })
})
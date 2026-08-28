import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  id: '123',
  title: 'Testing React',
  author: 'Connor',
  url: 'https://example.com',
  likes: 5,
  user: {
    id: '456',
    username: 'Connor123',
    name: 'Connor',
  },
}

test('unauthenticated user sees blog information but no buttons', () => {
  render(
    <Blog
      blog={blog}
      handleLike={vi.fn()}
      handleRemove={vi.fn()}
      user={null}
    />,
  )

  expect(screen.getByText('Testing React Connor')).toBeVisible()
  expect(screen.getByText('https://example.com')).toBeVisible()
  expect(screen.getByText('likes 5')).toBeVisible()

  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()

  expect(
    screen.queryByRole('button', { name: 'remove' }),
  ).not.toBeInTheDocument()
})

test('authenticated non-creator sees only the like button', () => {
  const otherUser = {
    username: 'OtherUser',
    name: 'Other User',
  }

  render(
    <Blog
      blog={blog}
      handleLike={vi.fn()}
      handleRemove={vi.fn()}
      user={otherUser}
    />,
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()

  expect(
    screen.queryByRole('button', { name: 'remove' }),
  ).not.toBeInTheDocument()
})

test('blog creator sees like and remove buttons', () => {
  const creator = {
    username: 'Connor123',
    name: 'Connor',
  }

  render(
    <Blog
      blog={blog}
      handleLike={vi.fn()}
      handleRemove={vi.fn()}
      user={creator}
    />,
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()

  expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
})

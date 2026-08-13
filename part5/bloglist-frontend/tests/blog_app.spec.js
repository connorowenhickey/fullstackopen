import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Connor',
        username: 'Connor123',
        password: 'test123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await page.getByLabel('username').fill('Connor123')
    await page.getByLabel('password').fill('test123')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(
      page.getByText('Connor logged in')
    ).toBeVisible()
  })

  test('login fails with incorrect credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await page.getByLabel('username').fill('Connor123')
    await page.getByLabel('password').fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(
      page.getByText('invalid username or password')
    ).toBeVisible()
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await page.getByLabel('username').fill('Connor123')
      await page.getByLabel('password').fill('test123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('Playwright blog')
      await inputs.nth(1).fill('Connor')
      await inputs.nth(2).fill('https://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('Playwright blog Connor')
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('Blog to like')
      await inputs.nth(1).fill('Connor')
      await inputs.nth(2).fill('https://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: /Blog to like/ }).click()

      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('Blog to delete')
      await inputs.nth(1).fill('Connor')
      await inputs.nth(2).fill('https://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: /Blog to delete/ }).click()

      page.on('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.getByText('Blog to delete Connor')
      ).not.toBeVisible()
    })
  })
})
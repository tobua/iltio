import { rest } from 'msw'
import { Label } from 'iltio'
import { test, expect } from './setup.js'

test('Has correct title.', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/iltio/)
})

test('Proper styles applied to wrapping form element.', async ({ page }) => {
  await page.goto('/')

  let context = await page.locator('#base')

  const form = context.getByLabel(Label.form)

  await expect(form).toHaveCSS('display', 'flex')
})

test('Custom mock.', async ({ page, worker }) => {
  await worker.use(
    rest.get('/api/authentication', (_, response, context) =>
      response(context.delay(250), context.status(403))
    )
  )

  expect(true).toBe(true)
})

import { test, expect } from '@playwright/test'
import { Label } from 'iltio'

test('Has correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/iltio/)
})

test('get started link', async ({ page }) => {
  await page.goto('/')

  let context = await page.locator('#base')

  const form = context.getByLabel(Label.form)

  await expect(form).toHaveCSS('display', 'flex')
})

import { Label } from 'iltio'
import { test, expect } from './setup.js'
import { Page } from '@playwright/test'

const wait = (duration: number) =>
  new Promise((done) => {
    setTimeout(done, duration * 1000)
  })

const loadPage = async (page: Page, tag = '#base') => {
  await page.goto('/')

  const context = page.locator(tag)

  // Svelte needs some time to bind handlers.
  await wait(0.5)

  return context
}

test.afterEach(async ({ page }) => {
  await page.evaluate(() => window.localStorage.clear())
  await page.evaluate(() => window.sessionStorage.clear())
})

test('When only phone is allowed tabs do not show up and phone input is displayed.', async ({
  page,
}) => {
  const context = await loadPage(page, '#phone')

  // No tabs
  const tabMail = context.getByLabel(Label.tabMail)
  await expect(tabMail).not.toBeAttached()
  const tabPhone = context.getByLabel(Label.tabPhone)
  await expect(tabPhone).not.toBeAttached()

  const inputMail = context.getByLabel(Label.inputMail)
  await expect(inputMail).not.toBeAttached()

  const inputPhone = context.getByLabel(Label.inputPhone)
  await expect(inputPhone).toBeVisible()

  const submit = context.getByLabel(Label.submit)
  await expect(submit).toBeVisible()
  await expect(submit).toHaveText('Submit')
})

test('Variables and style configuration properties are applied.', async ({ page }) => {
  const context = await loadPage(page, '#properties')

  const form = context.getByLabel(Label.form)
  await expect(form).toHaveCSS('width', '130px')

  const tabMail = context.getByLabel(Label.tabMail)
  await expect(tabMail).toHaveCSS('color', 'rgb(0, 0, 255)')
  const tabPhone = context.getByLabel(Label.tabPhone)
  await expect(tabPhone).toHaveCSS('color', 'rgb(0, 0, 255)')

  const inputMail = context.getByLabel(Label.inputMail)
  await expect(inputMail).toHaveCSS('border-color', 'rgb(0, 0, 255)')
  await expect(inputMail).toHaveCSS('border-radius', '10px')

  await tabPhone.click()

  const phoneWrapper = context.getByLabel(Label.phoneWrapper)
  await expect(phoneWrapper).toHaveCSS('border-color', 'rgb(0, 0, 255)')
  await expect(phoneWrapper).toHaveCSS('border-radius', '10px')

  const submit = context.getByLabel(Label.submit)
  await expect(submit).toHaveCSS('background-color', 'rgb(0, 0, 255)')
  await expect(submit).toHaveCSS('border-radius', '10px')
})

test.only('Custom components can be inserted for every framework and lead to the same result.', async ({
  page,
}) => {
  const context = await loadPage(page, '#custom')

  const form = context.getByLabel(Label.form)
  await expect(form).toHaveCSS('border', '1px dashed rgb(199, 199, 199)')
  await expect(form).toHaveCSS('width', '300px')
  await expect(form).toHaveCSS('padding', '20px')

  const tabWrapper = context.getByLabel(Label.tabWrapper)
  await expect(tabWrapper).toHaveCSS('background-color', 'rgb(204, 204, 204)')
  await expect(tabWrapper).toHaveCSS('padding', '10px')
  await expect(tabWrapper).toHaveCSS('border-radius', '10px')

  const inputMail = context.getByLabel(Label.inputMail)
  await expect(inputMail).toHaveCSS('border-top', '0px none rgb(0, 0, 0)')
  await expect(inputMail).toHaveCSS('border-bottom', '1px solid rgb(0, 0, 0)')
})

test('Styles are properly inherited from page.', async ({ page }) => {
  const context = await loadPage(page, '#styles')

  const tabMail = context.getByLabel(Label.tabMail)
  await expect(tabMail).toHaveCSS('font-family', 'monospace')
  await expect(tabMail).toHaveCSS('color', 'rgb(0, 128, 0)')
  await expect(tabMail).toHaveText('E-Mail')

  const submit = context.getByLabel(Label.submit)
  await expect(submit).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)') // Default browser background is transparent.
  await expect(submit).toHaveCSS('color', 'rgb(255, 0, 0)')
  await expect(submit).toHaveText('Inherited Background??')
})

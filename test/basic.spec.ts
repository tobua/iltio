import { rest } from 'msw'
import { Label } from 'iltio'
import { test, expect } from './setup.js'

test('Has correct title.', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/iltio/)
})

test('Proper styles and labels applied to initial elements.', async ({ page }) => {
  await page.goto('/')

  let context = page.locator('#base')

  const form = context.getByLabel(Label.form)
  await expect(form).toHaveCSS('display', 'flex')

  const tabMail = context.getByLabel(Label.tabMail)
  await expect(tabMail).toHaveText('Mail')

  const tabPhone = context.getByLabel(Label.tabPhone)
  await expect(tabPhone).toHaveText('Phone')

  const inputMail = context.getByLabel(Label.inputMail)
  await expect(inputMail).toHaveAttribute('placeholder', 'Mail')

  const submit = context.getByLabel(Label.submit)
  await expect(submit).toHaveText('Submit')
})

test('Tabs working properly.', async ({ page }) => {
  await page.goto('/')

  let context = page.locator('#base')

  const tabMail = context.getByLabel(Label.tabMail)
  await expect(tabMail).toHaveCSS('font-weight', '700')

  const tabPhone = context.getByLabel(Label.tabPhone)
  await expect(tabPhone).not.toHaveCSS('font-weight', '700')

  const inputMail = context.getByLabel(Label.inputMail)
  const inputPhone = context.getByLabel(Label.inputPhone)

  await expect(inputMail).toBeVisible()
  await expect(inputPhone).not.toBeVisible()

  await tabPhone.click()

  await expect(tabMail).not.toHaveCSS('font-weight', '700')
  await expect(tabPhone).toHaveCSS('font-weight', '700')
  await expect(inputMail).not.toBeVisible()
  await expect(inputPhone).toBeVisible()
})

test('Can open and use phone country dropdown.', async ({ page }) => {
  await page.goto('/')
  await page.reload()

  let context = page.locator('#base')

  const tabPhone = context.getByLabel(Label.tabPhone)
  await tabPhone.click()
  const phoneCountry = context.getByLabel(Label.phoneCountry)
  await expect(phoneCountry).toBeVisible()
  await expect(phoneCountry).toHaveText('🇺🇸+1')
  // Open country dropdown.
  await phoneCountry.click()

  const phoneInputCountrySearch = context.getByLabel(Label.phoneInputCountrySearch)
  await expect(phoneInputCountrySearch).toBeVisible()

  const countryIndonesia = context.getByText('Indonesia')
  await expect(countryIndonesia).toHaveText('🇮🇩 Indonesia')

  await countryIndonesia.click()

  await expect(phoneCountry).toHaveText('🇮🇩+62')
})

test('Shows an error if an invalid email inserted.', async ({ page }) => {
  await page.goto('/')

  let context = page.locator('#base')

  const inputMail = context.getByLabel(Label.inputMail)
  await inputMail.type('this-is-faulty')

  const submit = context.getByLabel(Label.submit)
  await submit.click()

  const inputError = context.getByLabel(Label.inputError)
  await expect(inputError).toBeVisible()
  await expect(inputError).toHaveText('Please enter a valid mail address.')
})

test('Can successfully submit a correct mail.', async ({ page, worker }) => {
  let lastRequestParams = new URLSearchParams()

  await worker.use(
    rest.get('https://iltio.com/api/authenticate', (request, response, context) => {
      lastRequestParams = request.url.searchParams
      return response(context.delay(250), context.status(403))
    })
  )

  await page.goto('/')

  let context = await page.locator('#base')

  const inputMail = context.getByLabel(Label.inputMail)

  await inputMail.type('i@matthiasgiger.com')

  const submit = context.getByLabel(Label.submit)

  await submit.click()

  expect(lastRequestParams.get('name')).toEqual('i@matthiasgiger.com')
  expect(lastRequestParams.get('token')).toEqual('demo')
})

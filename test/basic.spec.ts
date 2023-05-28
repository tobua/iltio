import { rest } from 'msw'
import { Label } from 'iltio'
import { test, expect } from './setup.js'
import { Page } from '@playwright/test'

const wait = (duration: number) =>
  new Promise((done) => {
    setTimeout(done, duration * 1000)
  })

const loadPage = async (page: Page) => {
  await page.goto('/')

  const context = page.locator('#base')

  // Svelte needs some time to bind handlers.
  await wait(0.5)

  return context
}

test.afterEach(async ({ page }) => {
  await page.evaluate(() => window.localStorage.clear())
  await page.evaluate(() => window.sessionStorage.clear())
})

test('Has correct title.', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/iltio/)
})

test('Proper styles and labels applied to initial elements.', async ({ page }) => {
  const context = await loadPage(page)

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
  const context = await loadPage(page)

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
  const context = await loadPage(page)

  const tabPhone = context.getByLabel(Label.tabPhone)
  await tabPhone.click()

  await wait(0.25) // Required for Svelte handlers.

  const phoneCountry = context.getByLabel(Label.phoneCountry)
  await expect(phoneCountry).toBeVisible()
  await expect(phoneCountry).toHaveText(/🇺🇸\s?\+1/)
  // Open country dropdown.
  await phoneCountry.click()

  const phoneInputCountrySearch = context.getByLabel(Label.phoneInputCountrySearch)
  await expect(phoneInputCountrySearch).toBeVisible()

  const countryIndonesia = context.getByText('Indonesia')
  await expect(countryIndonesia).toHaveText('🇮🇩 Indonesia')

  await countryIndonesia.click()

  await expect(phoneCountry).toHaveText(/🇮🇩\s?\+62/)

  // TODO test country filter input.
})

test('Shows an error if an invalid email address is inserted.', async ({ page }) => {
  const context = await loadPage(page)

  const inputMail = context.getByLabel(Label.inputMail)
  await inputMail.type('this-is-faulty@test') // Passes browser validation for type="email"

  const submit = context.getByLabel(Label.submit)
  await submit.click()

  const inputError = context.getByLabel(Label.inputError)
  await expect(inputError).toBeVisible()
  await expect(inputError).toHaveText('Please enter a valid mail address.')
  await expect(inputMail).toHaveCSS('border-color', 'rgb(255, 0, 0)')
})

test('Shows an error if an invalid phone number is inserted.', async ({ page }) => {
  const context = await loadPage(page)

  const tabPhone = context.getByLabel(Label.tabPhone)
  await tabPhone.click()

  const inputPhone = context.getByLabel(Label.inputPhone)
  await expect(inputPhone).toBeVisible()
  await inputPhone.type('this-is-faulty')

  const submit = context.getByLabel(Label.submit)
  await submit.click()

  const inputError = context.getByLabel(Label.inputError)
  await expect(inputError).toBeVisible()
  await expect(inputError).toHaveText('Please enter a valid  phone number.')
  const phoneWrapper = context.getByLabel(Label.phoneWrapper)
  await expect(phoneWrapper).toHaveCSS('border-color', 'rgb(255, 0, 0)')
})

test('Can successfully submit a correct mail address.', async ({ page, worker }) => {
  let lastRequestParams = new URLSearchParams()
  let pollRequestParams = new URLSearchParams()

  await worker.use(
    rest.get('https://iltio.com/api/authenticate', (request, response, context) => {
      lastRequestParams = request.url.searchParams
      return response(
        context.delay(50),
        context.status(200),
        context.json({ error: false, codeToken: 'code-token-123', registration: true })
      )
    })
  )

  await worker.use(
    rest.get('https://iltio.com/api/verify/poll', (request, response, context) => {
      pollRequestParams = request.url.searchParams
      return response(context.delay(50), context.status(200), context.json({ error: true }))
    })
  )

  const context = await loadPage(page)

  const inputMail = context.getByLabel(Label.inputMail)

  await inputMail.type('i@matthiasgiger.com')

  const submit = context.getByLabel(Label.submit)

  await submit.click()

  expect(lastRequestParams.get('name')).toEqual('i@matthiasgiger.com')
  expect(lastRequestParams.get('token')).toEqual('demo')

  const messageConfirm = context.getByLabel(Label.messageConfirm)
  await expect(messageConfirm).toBeVisible()
  await expect(messageConfirm).toHaveText(
    'Enter the code received in your mail below or confirm through the link.'
  )

  const resendCode = context.getByLabel(Label.resendCode)
  await expect(resendCode).toBeVisible()
  await expect(resendCode).toHaveText('Resend Code')

  expect(pollRequestParams.get('token')).toEqual('code-token-123')
})

test('Can successfully submit a correct phone number.', async ({ page, worker }) => {
  let lastRequestParams = new URLSearchParams()

  await worker.use(
    rest.get('https://iltio.com/api/authenticate', (request, response, context) => {
      lastRequestParams = request.url.searchParams
      return response(
        context.delay(50),
        context.status(200),
        context.json({ error: false, codeToken: '123', registration: true })
      )
    })
  )

  const context = await loadPage(page)

  const tabPhone = context.getByLabel(Label.tabPhone)
  await tabPhone.click()

  const phoneCountry = context.getByLabel(Label.phoneCountry)
  await phoneCountry.click()

  const countrySwitzerland = context.getByText('Switzerland')
  await countrySwitzerland.click()

  const inputPhone = context.getByLabel(Label.inputPhone)

  await inputPhone.type('799629162')

  const submit = context.getByLabel(Label.submit)

  await submit.click()

  expect(lastRequestParams.get('name')).toEqual('+41799629162')
  expect(lastRequestParams.get('token')).toEqual('demo')

  const messageConfirm = context.getByLabel(Label.messageConfirm)
  await expect(messageConfirm).toBeVisible()
  await expect(messageConfirm).toHaveText(
    'Enter the code received in your mail below or confirm through the link.'
  )

  const resendCode = context.getByLabel(Label.resendCode)
  await expect(resendCode).toBeVisible()
  await expect(resendCode).toHaveText('Resend Code')
})

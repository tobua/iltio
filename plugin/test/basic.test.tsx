import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'
import { authenticate, Form } from '../index'
import { Label } from '../label'

let response: any = { error: true }

const wait = (duration = 10) => new Promise((done) => setTimeout(done, duration))

window.fetch = vi.fn(
  () =>
    new Promise<{ json: any }>((done) =>
      done({ json: () => new Promise((done) => done(response)) })
    )
)

const fetchMockCalls = (window.fetch as any).mock.calls

expect.extend(matchers)

test('Can successfully register with a mail address.', async () => {
  const mailAddress = 'some@person.com'
  const onSuccessMock = vi.fn()

  render(<Form onSuccess={onSuccessMock} />)

  expect(screen.getByLabelText(Label.form)).toBeVisible()
  expect(screen.getByLabelText(Label.tabMail)).toHaveStyle({ fontWeight: 'bold' })
  expect(screen.getByLabelText(Label.tabPhone)).not.toHaveStyle({ fontWeight: 'bold' })

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  expect(screen.getByLabelText(Label.inputMail)).toHaveValue(mailAddress)

  expect(fetchMockCalls.length).toBe(0)

  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')
  expect(screen.getByLabelText(Label.submit)).toBeVisible()

  const codeToken = '123'

  response = {
    error: false,
    codeToken,
    registration: true,
    pollLink: 'https://iltio.com/api/verify/poll',
  }

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls.length).toBe(1)

  expect(fetchMockCalls[0][0]).toContain(`authenticate?name=${encodeURIComponent(mailAddress)}`)

  await wait()

  expect(() => screen.getByLabelText(Label.submit)).toThrow('Unable to find a label')

  const correctVerificationCode = '4567'
  const userToken = '8910'

  response = {
    error: false,
    token: userToken,
  }

  await userEvent.type(screen.getByLabelText(Label.inputNumber), correctVerificationCode)

  expect(screen.getByLabelText(Label.inputNumber)).toHaveValue(Number(correctVerificationCode))

  expect(fetchMockCalls.length).toBe(2)

  expect(fetchMockCalls[1][0]).toContain(
    `verify/confirm?code=${correctVerificationCode}&token=${codeToken}`
  )

  expect(onSuccessMock.mock.calls.length).toBe(1)
  expect(onSuccessMock.mock.calls[0][0]).toBe(mailAddress)
  expect(onSuccessMock.mock.calls[0][1]).toBe(userToken)
  expect(onSuccessMock.mock.calls[0][2]).toBe(true)
})

test('authenticate: Can successfully register and login.', async () => {
  response = {
    error: false,
    codeToken: '123',
    registration: true,
    pollLink: 'https://iltio.com/api/verify/poll',
  }

  let result = await authenticate('me@me.com')

  expect(result.error).toBe(false)
  expect(result.codeToken).toBe(response.codeToken)
  expect(result.pollLink).toBe(response.pollLink)
  expect(result.registration).toBe(true)

  response = {
    error: false,
    codeToken: '456',
    registration: false,
    pollLink: 'https://iltio.com/api/verify/poll',
  }

  result = await authenticate('me@me.com')

  expect(result.error).toBe(false)
  expect(result.codeToken).toBe(response.codeToken)
  expect(result.pollLink).toBe(response.pollLink)
  expect(result.registration).toBe(false)
})

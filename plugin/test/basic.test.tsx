import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test, vi, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { authenticate, stopPolling, Store } from 'iltio'
import { Authentication } from '../react/Authentication'
import { Label } from '../text'
import { mockFetch, wait } from './helper'

const { fetchMockCalls, setResponse, getResponse } = mockFetch()

afterEach(() => {
  stopPolling()
  vi.restoreAllMocks()
})

test('Can successfully register with a mail address.', async () => {
  const mailAddress = 'some@person.com'
  const onSuccessMock = vi.fn()

  render(<Authentication onSuccess={onSuccessMock} />)

  expect(screen.getByLabelText(Label.form)).toBeVisible()
  expect(screen.getByLabelText(Label.tabMail)).toHaveStyle({ fontWeight: 'bold' })
  expect(screen.getByLabelText(Label.tabPhone)).not.toHaveStyle({ fontWeight: 'bold' })

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  expect(screen.getByLabelText(Label.inputMail)).toHaveValue(mailAddress)

  expect(fetchMockCalls().length).toBe(0)

  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')
  expect(screen.getByLabelText(Label.submit)).toBeVisible()

  const codeToken = '123'

  setResponse({
    error: false,
    codeToken,
    registration: true,
  })

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls().length).toBe(2)

  expect(fetchMockCalls()[0][0]).toContain(`authenticate?name=${encodeURIComponent(mailAddress)}`)

  await wait()

  expect(() => screen.getByLabelText(Label.submit)).toThrow('Unable to find a label')
  expect(screen.getByLabelText(Label.registration)).toBeVisible()

  const correctVerificationCode = '4567'
  const userToken = '8910'

  setResponse({
    error: false,
    token: userToken,
  })

  await userEvent.type(screen.getByLabelText(Label.inputCode), correctVerificationCode)

  expect(fetchMockCalls().length).toBe(3)

  expect(fetchMockCalls()[2][0]).toContain(
    `verify/confirm?code=${correctVerificationCode}&token=${codeToken}`,
  )

  expect(onSuccessMock.mock.calls.length).toBe(1)
  expect(onSuccessMock.mock.calls[0][0]).toBe(mailAddress)
  expect(onSuccessMock.mock.calls[0][1]).toBe(userToken)
  expect(onSuccessMock.mock.calls[0][3]).toBe(true)
})

test('Can login with the same mail address.', async () => {
  const mailAddress = 'some@person.com'
  const onSuccessMock = vi.fn()

  Store.reset()

  render(<Authentication allowPhone={false} onSuccess={onSuccessMock} />)

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  const codeToken = '123'

  setResponse({
    error: false,
    codeToken,
    registration: false,
  })

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls().length).toBe(2)

  expect(fetchMockCalls()[0][0]).toContain(`authenticate?name=${encodeURIComponent(mailAddress)}`)

  await wait()

  expect(() => screen.getByLabelText(Label.submit)).toThrow('Unable to find a label')
  expect(() => screen.getByLabelText(Label.registration)).toThrow('Unable to find a label')
})

test('authenticate: Can successfully register and login.', async () => {
  setResponse({
    error: false,
    codeToken: '123',
    registration: true,
  })

  let result = await authenticate('me@me.com')

  expect(result.error).toBe(false)
  expect(result.codeToken).toBe(getResponse().codeToken)
  expect(result.registration).toBe(true)

  setResponse({
    error: false,
    codeToken: '456',
    registration: false,
  })

  result = await authenticate('me@me.com')

  expect(result.error).toBe(false)
  expect(result.codeToken).toBe(getResponse().codeToken)
  expect(result.registration).toBe(false)
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'
import { Form, configure } from '../index'
import { Label } from '../label'
import { mockFetch } from './helper'

expect.extend(matchers)

const { fetchMockCalls, setResponse } = mockFetch()

test('Can configure the token and the storage keys.', async () => {
  const mailAddress = 'some@person.com'
  const codeTokenStorageKey = 'test-key'
  const appToken = 'test-token'
  const storage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }

  configure({
    token: appToken,
    codeTokenStorageKey,
    storage,
  })

  render(<Form />)

  expect(storage.setItem.mock.calls.length).toBe(0)

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  const codeToken = '123'

  setResponse({
    error: false,
    codeToken,
    registration: true,
    pollLink: 'https://iltio.com/api/verify/poll',
  })

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls.length).toBe(1)

  expect(fetchMockCalls[0][0]).toContain(`token=${appToken}`)

  const storageCalls = storage.setItem.mock.calls

  expect(storageCalls.length).toBe(2)

  expect(storageCalls[0]).toEqual([codeTokenStorageKey, codeToken])
  expect(storageCalls[1]).toEqual(['auth-name', mailAddress])
})

test('Can configure the initial phone country code.', async () => {
  const { unmount } = render(<Form />)

  await userEvent.click(screen.getByLabelText(Label.tabPhone))

  expect(screen.getByLabelText(Label.phoneCountry)).toHaveValue('us')
  expect(screen.getByLabelText(Label.phonePrefix)).toHaveTextContent('+1')

  unmount()

  render(<Form initialCountryCode="ch" />)

  await userEvent.click(screen.getByLabelText(Label.tabPhone))

  expect(screen.getByLabelText(Label.phoneCountry)).toHaveValue('ch')
  expect(screen.getByLabelText(Label.phonePrefix)).toHaveTextContent('+41')
})

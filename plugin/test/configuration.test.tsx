import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'
import { authenticate, Form, configure } from '../index'
import { Label } from '../label'

let response: any = { error: true }

const wait = (duration = 10) => new Promise((done) => setTimeout(done, duration))

// @ts-ignore
window.fetch = vi.fn(
  () =>
    new Promise<{ json: any }>((done) =>
      done({ json: () => new Promise((done) => done(response)) })
    )
)

const fetchMockCalls = (window.fetch as any).mock.calls

expect.extend(matchers)

test('Can configure the storage keys.', async () => {
  const mailAddress = 'some@person.com'
  const codeTokenStorageKey = 'test-key'
  const storage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }

  configure({
    token: 'test',
    codeTokenStorageKey,
    storage,
  })

  render(<Form />)

  expect(storage.setItem.mock.calls.length).toBe(0)

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  const codeToken = '123'

  response = {
    error: false,
    codeToken,
    registration: true,
    pollLink: 'https://iltio.com/api/verify/poll',
  }

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls.length).toBe(1)

  const storageCalls = storage.setItem.mock.calls

  expect(storageCalls.length).toBe(2)

  expect(storageCalls[0]).toEqual([codeTokenStorageKey, codeToken])
  expect(storageCalls[1]).toEqual(['auth-name', mailAddress])
})

// TODO initial country code fails.

import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'
import { authenticate, Form } from '../index'
import { Label } from '../label'

let response: any = { error: true }

window.fetch = vi.fn(
  () =>
    new Promise<{ json: any }>((done) =>
      done({ json: () => new Promise((done) => done(response)) })
    )
)

const fetchMockCalls = (window.fetch as any).mock.calls

expect.extend(matchers)

test('Works with localStorage and sessionStorage.', async () => {
  render(<Form />)

  expect(screen.getByLabelText(Label.form)).toBeVisible()
  expect(screen.getByLabelText(Label.tabMail)).toHaveStyle({ fontWeight: 'bold' })
  expect(screen.getByLabelText(Label.tabPhone)).not.toHaveStyle({ fontWeight: 'bold' })

  await userEvent.type(screen.getByLabelText(Label.inputMail), 'some@person.com')

  expect(screen.getByLabelText(Label.inputMail)).toHaveValue('some@person.com')

  expect(fetchMockCalls.length).toBe(0)

  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')
  expect(screen.getByLabelText(Label.submit)).toBeVisible()

  response = {
    error: false,
    codeToken: '123',
    registration: true,
    pollLink: 'https://iltio.com/api/verify/poll',
  }

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls.length).toBe(1)

  await new Promise((done) => setTimeout(done, 10))

  expect(() => screen.getByLabelText(Label.submit)).toThrow('Unable to find a label')
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

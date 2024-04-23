import React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Authentication } from '../react/Authentication'
import { Label } from '../text'
import { mockFetch } from './helper'

const { fetchMockCalls } = mockFetch()

afterEach(() => {
  vi.restoreAllMocks()
})

test('Invalid mail address leads to invalid input.', async () => {
  const mailAddress = 'some@person'
  const onSuccessMock = vi.fn()

  render(<Authentication allowPhone={false} onSuccess={onSuccessMock} />)

  expect(screen.getByLabelText(Label.form)).toBeVisible()
  expect(() => screen.getByLabelText(Label.tabMail)).toThrow('Unable to find a label')
  expect(() => screen.getByLabelText(Label.tabPhone)).toThrow('Unable to find a label')

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  expect(screen.getByLabelText(Label.inputMail)).toHaveValue(mailAddress)
  expect(fetchMockCalls().length).toBe(0)
  expect(screen.getByLabelText(Label.inputMail)).toHaveAttribute('aria-invalid', 'false')
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls().length).toBe(0)
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')
  expect(screen.getByLabelText(Label.inputMail)).toHaveAttribute('aria-invalid', 'true')
})

test('No submit with empty mail address.', async () => {
  render(<Authentication allowPhone={false} />)

  const inputMail = screen.getByLabelText(Label.inputMail)

  expect(inputMail).toHaveValue('')
  // Type something to avoid "required" attribute preventing submit.
  await userEvent.type(inputMail, 'test@test')

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls().length).toBe(0)
  expect(inputMail).toHaveAttribute('aria-invalid', 'true')
})

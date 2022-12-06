import React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'
import { Form } from '../index'
import { Label } from '../label'
import { mockFetch } from './helper'

expect.extend(matchers)

const { fetchMockCalls } = mockFetch()

afterEach(() => {
  vi.restoreAllMocks()
})

test('Invalid mail address leads to invalid input.', async () => {
  const mailAddress = 'some@person'
  const onSuccessMock = vi.fn()

  render(<Form allowPhone={false} onSuccess={onSuccessMock} />)

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
  render(<Form allowPhone={false} />)

  expect(screen.getByLabelText(Label.inputMail)).toHaveValue('')

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls().length).toBe(0)
  expect(screen.getByLabelText(Label.inputMail)).toHaveAttribute('aria-invalid', 'true')
})

import React from 'react'
import { act, render, screen } from '@testing-library/react'
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

test('Invalid phone number leads to invalid input.', async () => {
  const invalidPhoneNumber = 'abc'

  render(<Authentication allowMail={false} />)

  expect(screen.getByLabelText(Label.form)).toBeVisible()
  expect(() => screen.getByLabelText(Label.tabMail)).toThrow('Unable to find a label')
  expect(() => screen.getByLabelText(Label.tabPhone)).toThrow('Unable to find a label')

  await userEvent.type(screen.getByLabelText(Label.inputPhone), invalidPhoneNumber)

  expect(screen.getByLabelText(Label.inputPhone)).toHaveValue(invalidPhoneNumber)
  expect(fetchMockCalls().length).toBe(0)
  expect(screen.getByLabelText(Label.inputPhone)).toHaveAttribute('aria-invalid', 'false')
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')

  await act(async () => {
    await userEvent.click(screen.getByLabelText(Label.submit))
  })

  expect(fetchMockCalls().length).toBe(0)
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')
  expect(screen.getByLabelText(Label.inputPhone)).toHaveAttribute('aria-invalid', 'true')
})

test('No submit with empty phone number.', async () => {
  render(<Authentication allowMail={false} />)

  expect(screen.getByLabelText(Label.inputPhone)).toHaveValue('')
  // Type something to avoid "required" attribute preventing submit.
  await userEvent.type(screen.getByLabelText(Label.inputPhone), ' ')

  await act(async () => {
    await userEvent.click(screen.getByLabelText(Label.submit))
  })

  expect(fetchMockCalls().length).toBe(0)
  expect(screen.getByLabelText(Label.inputPhone)).toHaveAttribute('aria-invalid', 'true')
})

test('Valid phone number is submitted.', async () => {
  const phoneNumber = '799629162'

  render(<Authentication allowMail={false} />)

  await userEvent.type(screen.getByLabelText(Label.inputPhone), phoneNumber)

  expect(screen.getByLabelText(Label.inputPhone)).toHaveAttribute('aria-invalid', 'false')

  await act(async () => {
    await userEvent.click(screen.getByLabelText(Label.submit))
  })

  expect(fetchMockCalls().length).toBe(1)
  expect(fetchMockCalls()[0][0]).toContain(encodeURIComponent(`+1${phoneNumber}`))
})

test('Country can be selected.', async () => {
  const phoneNumber = '799629162'

  render(<Authentication allowMail={false} />)

  expect(screen.getByLabelText(Label.phoneCountry)).toHaveAttribute('data-country', 'us')

  await userEvent.click(screen.getByLabelText(Label.phoneCountry))

  const switzerlandButton = screen.getByTestId('ch')

  await userEvent.click(switzerlandButton)

  expect(screen.getByLabelText(Label.phoneCountry)).toHaveAttribute('data-country', 'ch')

  await userEvent.type(screen.getByLabelText(Label.inputPhone), phoneNumber)

  expect(screen.getByLabelText(Label.inputPhone)).toHaveAttribute('aria-invalid', 'false')

  await act(async () => {
    await userEvent.click(screen.getByLabelText(Label.submit))
  })

  expect(fetchMockCalls().length).toBe(1)
  expect(fetchMockCalls()[0][0]).toContain(encodeURIComponent(`+41${phoneNumber}`))
})

test('Countries can be filtered.', async () => {
  render(<Authentication allowMail={false} />)

  expect(screen.getByLabelText(Label.phoneCountry)).toHaveAttribute('data-country', 'us')

  await userEvent.click(screen.getByLabelText(Label.phoneCountry))

  const displayedCountriesCount = () => screen.getAllByLabelText(Label.phoneCountryOption).length

  expect(displayedCountriesCount()).toBeGreaterThan(100)

  await userEvent.type(screen.getByLabelText(Label.phoneInputCountrySearch), 'swi')

  expect(displayedCountriesCount()).toBeLessThan(5)
})

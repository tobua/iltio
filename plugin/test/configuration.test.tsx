import React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'
import styled from 'styled-components'
import { Form, configure } from '../index'
import { Label } from '../label'
import { mockFetch, mockInterval } from './helper'

expect.extend(matchers)

const { fetchMockCalls, setResponse, resetFetchMock } = mockFetch()

afterEach(() => {
  resetFetchMock()
})

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

test('Can add React components to override default elements.', async () => {
  function MyButton({ ...props }) {
    return (
      <div {...props} data-hello="world">
        Hello
      </div>
    )
  }

  const { unmount } = render(<Form Components={{ Button: MyButton }} />)

  expect(screen.getByLabelText(Label.submit)).toBeVisible()
  expect(screen.getByLabelText(Label.submit)).toHaveAttribute('data-hello', 'world')
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Hello')

  unmount()

  function MyVariablesButton({ variables, children, style, ...props }: any) {
    return (
      <div {...props} style={{ ...style, backgroundColor: variables.color }}>
        {children}
      </div>
    )
  }

  render(
    <Form
      variables={{ color: 'blue' }}
      submitLabel="Submit Button"
      Components={{ Button: MyVariablesButton }}
    />
  )

  expect(screen.getByLabelText(Label.submit)).toHaveStyle({ 'background-color': 'blue' })
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit Button')
})

test('Can configure styled-components without type errors.', async () => {
  const StyledButton = styled.button({
    backgroundColor: 'blue',
    borderRadius: 20,
  })

  render(<Form Components={{ Button: StyledButton }} />)

  expect(screen.getByLabelText(Label.submit)).toBeVisible()
  expect(screen.getByLabelText(Label.submit)).toHaveStyle({
    'background-color': 'blue',
    'border-radius': '20px',
  })
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')
})

test('Polling interval can be configured.', async () => {
  const { runInterval, getDuration } = mockInterval()
  const mailAddress = 'some@person.com'

  configure({ pollDuration: 200, token: 'test' }) // Poll every 200ms.

  render(<Form />)

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

  expect(() => screen.getByLabelText(Label.submit)).toThrow('Unable to find a label')

  expect(getDuration()).toBe(200)

  runInterval()

  expect(fetchMockCalls.length).toBe(1) // TODO should have made poll call.
})

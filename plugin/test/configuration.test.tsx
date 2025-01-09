import React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import styled from 'styled-components'
// Ensures same configuration used as regular implementation.
import { MemoryStorage, configure, reset, Store } from 'iltio'
import { Authentication } from '../react/Authentication'
import { Label } from '../text'
import { mockFetch, mockInterval, wait } from './helper'

const { fetchMockCalls, setResponse } = mockFetch()

afterEach(() => {
  reset()
  vi.restoreAllMocks()
})

test('Can configure the token and the storage keys.', async () => {
  const mailAddress = 'some@person.com'
  const codeTokenStorageKey = 'test-key'
  const appToken = 'test-token'

  const MockStorage = {
    data: {} as { [key: string]: string },
    getItem: vi.fn((key: string) => MemoryStorage.data[key]),
    setItem: vi.fn((key: string, value: any) => {
      MemoryStorage.data[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete MemoryStorage.data[key]
    }),
  }

  configure({
    token: appToken,
    codeTokenStorageKey,
    storage: MockStorage,
  })

  render(<Authentication />)

  expect(MockStorage.setItem.mock.calls.length).toBe(0)

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  const codeToken = '123'

  setResponse({
    error: false,
    codeToken,
    registration: true,
  })

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls().length).toBe(2)
  expect(fetchMockCalls()[0][0]).toContain(`token=${appToken}`)

  const storageCalls = MockStorage.setItem.mock.calls

  expect(storageCalls.length).toBe(2)

  expect(storageCalls[0]).toEqual([codeTokenStorageKey, codeToken])
  expect(storageCalls[1]).toEqual(['auth-name', mailAddress])
})

test('Can configure the initial phone country code.', async () => {
  const { unmount } = render(<Authentication />)

  await userEvent.click(screen.getByLabelText(Label.tabPhone))

  expect(screen.getByLabelText(Label.phoneCountry)).toHaveAttribute('data-country', 'us')
  expect(screen.getByLabelText(Label.phoneCountry)).toHaveTextContent('🇺🇸+1')

  unmount()

  render(<Authentication initialCountryCode="ch" />)

  await userEvent.click(screen.getByLabelText(Label.tabPhone))

  expect(screen.getByLabelText(Label.phoneCountry)).toHaveAttribute('data-country', 'ch')
  expect(screen.getByLabelText(Label.phoneCountry)).toHaveTextContent('🇨🇭+41')
})

test('Can add React components to override default elements.', async () => {
  function MyButton({ ...props }) {
    return (
      <div {...props} data-hello="world">
        Hello
      </div>
    )
  }

  const { unmount } = render(<Authentication Components={{ Button: MyButton }} />)

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
    <Authentication
      variables={{ color: 'blue' }}
      labels={{ submit: 'Submit Button' }}
      Components={{ Button: MyVariablesButton }}
    />,
  )

  expect(screen.getByLabelText(Label.submit)).toHaveStyle({ 'background-color': 'blue' })
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit Button')
})

test('Can configure styled-components without type errors.', async () => {
  const StyledButton = styled.button({
    backgroundColor: 'blue',
    borderRadius: 20,
  })

  render(<Authentication Components={{ Button: StyledButton }} />)

  expect(screen.getByLabelText(Label.submit)).toBeVisible()
  // Will add classes which are not picked up by toHaveStyle in this environment.
  expect(screen.getByLabelText(Label.submit).className).not.toBe('')
  expect(screen.getByLabelText(Label.submit)).toHaveTextContent('Submit')
})

test('Polling interval can be configured.', async () => {
  const { runInterval, getDuration } = mockInterval()
  const mailAddress = 'some@person.com'
  const onSuccessMock = vi.fn()

  // Poll every 200ms, reset previously changed storage.
  configure({ pollDuration: 200, token: 'test', storage: MemoryStorage })

  Store.reset()

  render(<Authentication onSuccess={onSuccessMock} />)

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  const codeToken = '123'

  setResponse({
    error: false,
    codeToken,
    registration: true,
  })

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls().length).toBe(2)

  expect(() => screen.getByLabelText(Label.submit)).toThrow('Unable to find a label')

  expect(getDuration()).toBe(200)

  setResponse({
    error: false,
  })

  runInterval()
  await wait()

  expect(fetchMockCalls().length).toBe(3)
  expect(fetchMockCalls()[fetchMockCalls().length - 1][0]).toContain('verify/poll')
  expect(fetchMockCalls()[fetchMockCalls().length - 1][0]).toContain(`token=${codeToken}`)

  setResponse({
    error: false,
    token: '789',
  })

  expect(onSuccessMock.mock.calls.length).toBe(0)

  runInterval()
  await wait()

  expect(fetchMockCalls().length).toBe(4)
  expect(fetchMockCalls()[fetchMockCalls().length - 1][0]).toContain('verify/poll')
  expect(onSuccessMock.mock.calls.length).toBe(1)
})

test('Can configure the token on the JSX tag as well.', async () => {
  const mailAddress = 'some@person.com'
  const appTokenModified = 'test-token-modified'

  Store.reset()

  render(<Authentication configuration={{ token: appTokenModified }} />)

  await userEvent.type(screen.getByLabelText(Label.inputMail), mailAddress)

  const codeToken = '123'

  setResponse({
    error: false,
    codeToken,
    registration: true,
  })

  await userEvent.click(screen.getByLabelText(Label.submit))

  expect(fetchMockCalls().length).toBe(2)

  expect(fetchMockCalls()[0][0]).toContain(`token=${appTokenModified}`)
})

import { expect, test, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { Store } from '../index'
import { mockFetch } from './helper'
import { generateEncryptionKey, encryptText, decryptText } from '../encrypt'

const { fetchMockCalls, setResponse } = mockFetch()

afterEach(() => {
  vi.restoreAllMocks()
})

test('Can enable encryption and add a key.', async () => {
  expect(fetchMockCalls().length).toBe(0)
})

test('Can generate an encryption key, encrypt and decrypt some text.', async () => {
  const key = await generateEncryptionKey()
  expect(typeof key).toBe('string')
  expect((key as string).length).toBe(24)

  const text = 'Hello Encryption'
  Store.encryptionKey = key as string

  const encryptedText = await encryptText(text)
  expect(encryptedText).not.toBe(text)
  expect(encryptedText.length).toBe(44)

  const decryptedText = await decryptText(encryptedText)
  expect(decryptedText).toBe(text)
})

test('Reissues expired JWT.', async () => {
  const now = new Date(Date.now()).toISOString()
  Store.jsonWebToken = { token: '123', expirationDate: now }

  let jsonWebToken = await Store.jsonWebToken
  expect(jsonWebToken).toEqual('123')

  expect(fetchMockCalls().length).toBe(0)

  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()

  Store.jsonWebToken = { token: '456', expirationDate: tenDaysAgo }

  setResponse({
    error: false,
    jsonWebToken: { token: '789', expirationDate: now },
  })

  jsonWebToken = await Store.jsonWebToken
  expect(jsonWebToken).toEqual('789')

  expect(fetchMockCalls().length).toBe(1) // Refetched JWT.
})

import { expect, test, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { app } from '../index'
import { mockFetch } from './helper'
import { generateEncryptionKey, encryptText, decryptText } from '../encrypt'

const { fetchMockCalls, setResponse, getResponse } = mockFetch()

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
  app.encryptionKey = key as string

  const encryptedText = await encryptText(text)
  expect(encryptedText).not.toBe(text)
  expect(encryptedText.length).toBe(44)

  const decryptedText = await decryptText(encryptedText)
  expect(decryptedText).toBe(text)
})

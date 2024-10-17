import { expect, test, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { mockFetch } from './helper'
import { generateEncryptionKey, encryptText, decryptText } from '../encrypt'
import { encrypt, Store, configure, decrypt } from '../index'
import { hasEncryptionPrefix } from '../store'

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

test('Can set an encrption key and encrypt various payloads.', async () => {
  // @ts-ignore
  Store.encryptionKey = undefined
  const missingKey = await encrypt({ id: 1 }, { allowUnencrypted: false })
  expect(missingKey).toEqual(false) // Missing encryption key.
  const key = await generateEncryptionKey()
  expect(typeof key === 'string' && key !== '').toBe(true)
  Store.encryptionKey = key as string
  const successfulEncryption = await encrypt({ id: 1 })
  expect(hasEncryptionPrefix(successfulEncryption && successfulEncryption.id)).toBe(true)
  expect(successfulEncryption && successfulEncryption.id.length).toEqual(28)
})

test('Ignored properties will not be encrypted.', async () => {
  const key = await generateEncryptionKey()
  Store.encryptionKey = key as string
  const successfulEncryption = await encrypt(
    { id: 2, message: 'Hello World!' },
    { ignoreKeys: ['id'] },
  )
  expect(successfulEncryption && successfulEncryption.id).toBe(2)
  expect(successfulEncryption && successfulEncryption.message).not.toBe('Hello World!')
  expect(hasEncryptionPrefix(successfulEncryption && successfulEncryption.id)).toBe(false)
  expect(hasEncryptionPrefix(successfulEncryption && successfulEncryption.message)).toBe(true)
})

test('Proper types for data input and output.', async () => {
  const key = await generateEncryptionKey()
  Store.encryptionKey = key as string
  const successfulEncryption = await encrypt(
    { id: 2, message: 'Hello World!' },
    // @ts-expect-error Missing key not available.
    { ignoreKeys: ['id', 'missing'] },
  )
  const anotherId: number | false = successfulEncryption && successfulEncryption.id
  expect(anotherId).toBe(2)
})

test('Only included keys are encrypted.', async () => {
  const key = await generateEncryptionKey()
  Store.encryptionKey = key as string
  const encryptionResult = await encrypt(
    { first: 'first', second: 'second', third: 'third' },
    { includeKeys: ['second'] },
  )
  expect(encryptionResult && encryptionResult.first).toBe('first')
  expect(encryptionResult && encryptionResult.second).not.toBe('second')
  expect(encryptionResult && encryptionResult.third).toBe('third')
})

test('Will error if a keys maxLength if exceeded.', async () => {
  const key = await generateEncryptionKey()
  Store.encryptionKey = key as string
  let encryptionResult = await encrypt(
    { content: 'Hello World! This message is really long!!' },
    { keys: { content: { maxLength: 20 } } },
  )
  expect(encryptionResult).toBe(false)

  encryptionResult = await encrypt(
    { content: 'Hello World! This message is really long!!' },
    { keys: { content: { maxLength: 256 } } },
  )
  expect(encryptionResult).not.toBe(false)
  expect(encryptionResult && encryptionResult.content.length).toBeGreaterThan(20)
})

test('Can configure the encryption prefix.', async () => {
  const prefix = 'this_is_encrypted!!'
  configure({ encryptionPrefix: prefix })
  const key = await generateEncryptionKey()
  Store.encryptionKey = key as string
  const encryptionResult = await encrypt({ first: 'first', second: 'second' })

  expect(encryptionResult && encryptionResult.first.startsWith(`${prefix}_`)).toBe(true)
  expect(encryptionResult && encryptionResult.second.startsWith(`${prefix}_`)).toBe(true)
})

test('Can decrypt encrypted objects.', async () => {
  const key = await generateEncryptionKey()
  Store.encryptionKey = key as string
  const encryptionResult = await encrypt(
    { first: 'first', second: 'second', unencrypted: 'unencrypted' },
    { ignoreKeys: ['unencrypted'] },
  )
  expect(encryptionResult).not.toBe(false)

  if (encryptionResult) {
    const decryptionResult = await decrypt({ ...encryptionResult })
    expect(decryptionResult.first).toBe('first')
    expect(decryptionResult.first).not.toEqual(encryptionResult.first)
    // @ts-expect-error Only available with flag.
    expect(decryptionResult.iltioEncrypted).not.toBeDefined()

    const flaggedDecryptionResult = await decrypt({ ...encryptionResult }, { flagStatus: true })
    expect(flaggedDecryptionResult.iltioEncrypted).toBe(true)
  }
})

import { generateEncryptionKey } from '../encrypt'
import { joinUrl } from '../helper'
import { encrypt, configure, Store } from '../index'
import { hasEncryptionPrefix, removeEncryptionPrefix } from '../store'

test('Properly joins URLs.', () => {
  expect(joinUrl('/authorize')).toBe('https://iltio.com/api/authorize')
  expect(joinUrl('authorize?token=123&more=456')).toBe(
    'https://iltio.com/api/authorize?token=123&more=456',
  )

  // Another base.
  expect(joinUrl('authorize?token=123&more=456', 'http://localhost:3001/nested/deep/')).toBe(
    'http://localhost:3001/nested/deep/authorize?token=123&more=456',
  )
})

test('Can set an encrption key and encrypt various payloads.', async () => {
  const missingKey = await encrypt({ id: 1 })
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
  const successfulEncryption = await encrypt({ id: 2, message: 'Hello World!' }, ['id'])
  expect(successfulEncryption && successfulEncryption.id).toBe(2)
  expect(successfulEncryption && successfulEncryption.message).not.toBe('Hello World!')
  expect(hasEncryptionPrefix(successfulEncryption && successfulEncryption.id)).toBe(false)
  expect(hasEncryptionPrefix(successfulEncryption && successfulEncryption.message)).toBe(true)
})

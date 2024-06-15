import { app } from './index'

let cryptoKey: CryptoKey

async function getCryptoKey() {
  if (cryptoKey) {
    return cryptoKey
  }

  const localCryptoKey = await importKeyFromString(app.encryptionKey)

  if (!localCryptoKey) {
    console.error('iltio: Failed to import crypto key.')
    throw new Error('Failed to local crypto key.')
  }

  cryptoKey = localCryptoKey

  return localCryptoKey
}

const keyLength = 128 // 128, 192, 265

const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

export async function encryptText(value: string) {
  const cryptoKey = await getCryptoKey()
  const input = new TextEncoder().encode(value)
  const encryptedText = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      length: keyLength,
      iv: window.crypto.getRandomValues(new Uint8Array(12)),
    },
    cryptoKey,
    input,
  )
  return arrayBufferToBase64(encryptedText)
}

export async function encrypt<T extends object>(data: T, ignoreKeys: string[] = []) {
  if (!app.encryptionKey) {
    console.error('iltio: Missing encryption key.')
    return false
  }

  for (const [key, value] of Object.entries(data)) {
    if (ignoreKeys.includes(key)) continue
    const text = String(value)
    try {
      data[key] = await encryptText(text)
    } catch (error) {
      console.error('iltio: Error encrypting data:', error)
    }
  }

  return data as { [K in keyof T]: string } // All values serialized to strings.
}

async function importKeyFromString(keyString: string) {
  try {
    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      new Uint8Array(
        window
          .atob(keyString)
          .split('')
          .map((char) => char.charCodeAt(0)),
      ),
      { name: 'AES-GCM', length: keyLength },
      true,
      ['encrypt', 'decrypt'], //
    )
    return importedKey
  } catch (error) {
    console.error('iltio: Error importing encryption key:', error)
    return null
  }
}

async function serializeEncryptionKey(key: CryptoKey) {
  try {
    const exportedRawKey = await window.crypto.subtle.exportKey('raw', key)
    return arrayBufferToBase64(exportedRawKey)
  } catch (error) {
    console.error('iltio: Error serializing encryption key:', error)
    return null
  }
}

export async function generateEncryptionKey() {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: keyLength,
      },
      true,
      ['encrypt', 'decrypt'],
    )
    return serializeEncryptionKey(key)
  } catch (error) {
    console.error('iltio: Error generating encryption key:', error)
    return false
  }
}

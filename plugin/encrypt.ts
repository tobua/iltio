import { Store } from './index'

function stringToIv(ivString) {
  const binaryString = atob(ivString)
  const iv = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    iv[i] = binaryString.charCodeAt(i)
  }
  return iv
}

function ivToString(iv: Uint8Array) {
  return btoa(String.fromCharCode(...iv))
}

const state: { cryptoKey: CryptoKey; initializationVector: Uint8Array } = {
  cryptoKey: null,
  initializationVector: stringToIv('UxjZQV8Lgc7Sh+Wo'),
}

// let cryptoKey: CryptoKey
// const initializationVector = stringToIv('UxjZQV8Lgc7Sh+Wo') // window.crypto.getRandomValues(new Uint8Array(12))

export const removeCryptoKey = () => {
  state.cryptoKey = null
  console.log(state.cryptoKey, Store.encryptionKey)
}

const getCryptoKey = async () => {
  if (state.cryptoKey) {
    // TODO old encryption key not properly deleted.
    // return state.cryptoKey
  }

  const localCryptoKey = await importKeyFromString(Store.encryptionKey)

  if (!localCryptoKey) {
    console.error('iltio: Failed to import crypto key.')
    throw new Error('Failed to local crypto key.')
  }

  state.cryptoKey = localCryptoKey

  return localCryptoKey
}

const keyLength = 128 // 128, 192, 265

const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

export async function encryptText(value: string) {
  const currentCryptoKey = await getCryptoKey()
  const input = new TextEncoder().encode(value)
  const encryptedText = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      length: keyLength,
      iv: state.initializationVector,
    },
    currentCryptoKey,
    input,
  )
  return arrayBufferToBase64(encryptedText)
}

function base64ToArrayBuffer(base64: string) {
  const binary = window.atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export async function decryptText(text: string) {
  const currentCryptoKey = await getCryptoKey()
  const encryptedTextBuffer = base64ToArrayBuffer(text)

  const decryptedText = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: state.initializationVector,
    },
    currentCryptoKey,
    encryptedTextBuffer,
  )

  return new TextDecoder().decode(decryptedText)
}

export async function encrypt<T extends object>(data: T, ignoreKeys: string[] = []) {
  if (!Store.encryptionKey) {
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
      ['encrypt', 'decrypt'],
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

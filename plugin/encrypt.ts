import { Store } from './index'
import { addEncryptionPrefix, hasEncryptionPrefix, removeEncryptionPrefix } from './store'

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

export async function encrypt<T extends object, K extends keyof T = never>(
  data: T,
  options: {
    ignoreKeys?: K[]
    includeKeys?: (keyof T)[]
    keys?: { [key in keyof T]?: { maxLength?: number } }
    allowUnencrypted?: boolean
  } = {
    ignoreKeys: [],
    keys: {},
    allowUnencrypted: true,
  },
) {
  if (!Store.encryptionKey) {
    if (options.allowUnencrypted) {
      return data as { [L in keyof T]: L extends K ? T[L] : string } // Types as if converted.
    }
    console.error('iltio: Missing encryption key.')
    return false
  }

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(options.ignoreKeys) && options.ignoreKeys.includes(key as K)) continue
    if (Array.isArray(options.includeKeys) && !options.includeKeys.includes(key as keyof T))
      continue

    const text = String(value)
    try {
      const encryptedText = addEncryptionPrefix(await encryptText(text))

      if (options.keys?.[key] && encryptedText.length > options.keys[key].maxLength) {
        console.warn(`Skipping encryption of key "${key}" as maxLength has been exceeded`)
        return false
      } else {
        data[key] = encryptedText
      }
    } catch (error) {
      console.error('iltio: Error encrypting data:', error)
    }
  }

  return data as { [L in keyof T]: L extends K ? T[L] : string } // All encrypted values serialized to strings.
}

export async function decrypt<T extends object>(
  data: T,
  options: {
    ignoreKeys?: string[]
    includeKeys?: string[]
    allowUnencrypted?: boolean
  } = {
    ignoreKeys: [],
    allowUnencrypted: true,
  },
) {
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(options.ignoreKeys) && options.ignoreKeys.includes(key)) continue
    if (Array.isArray(options.includeKeys) && !options.includeKeys.includes(key)) continue

    const text = String(value)
    if (!hasEncryptionPrefix(text)) continue
    try {
      data[key] = await decryptText(removeEncryptionPrefix(text))
    } catch (error) {
      console.error('iltio: Error decrypting data:', error)
    }
  }

  return data // TODO transform types?
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

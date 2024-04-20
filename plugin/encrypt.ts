import { app } from './index'

const keyLength = 128 // 128, 192, 265

// function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
//   const uint8Array = new Uint8Array(arrayBuffer)
//   const base64String = btoa(String.fromCharCode.apply(null, uint8Array))
//   return base64String
// }

function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer)
  let binary = ''
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i])
  }
  return window.btoa(binary)
}

export async function encrypt<T extends object>(data: T, ignoreKeys: string[] = []) {
  if (!app.encryptionKey) {
    console.error('iltio: Missing encryption key.')
    return false
  }

  const cryptoKey = await importKeyFromString(app.encryptionKey)

  if (!cryptoKey) {
    console.error('iltio: Failed to import crypto key.')
    return false
  }

  for (const [key, value] of Object.entries(data)) {
    if (ignoreKeys.includes(key)) continue
    const strValue = String(value)
    const input = new TextEncoder().encode(strValue)
    try {
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          // length: keyLength,
          iv: window.crypto.getRandomValues(new Uint8Array(12)),
        },
        cryptoKey,
        input,
      )
      data[key] = arrayBufferToBase64(encryptedData)
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
    return arrayBufferToBase64(exportedRawKey) // arrayBufferToBase64(exportedKey)
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
      true, // extractable
      ['encrypt', 'decrypt'],
    )
    return serializeEncryptionKey(key)
  } catch (error) {
    console.error('iltio: Error generating encryption key:', error)
    return false
  }
}

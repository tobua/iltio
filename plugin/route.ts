import { app, Store } from './store'
import { joinUrl } from './helper'
import { removeCryptoKey } from './encrypt'

async function fetchWithError(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      return await response.json() // Error message from server.
    }

    return await response.json() // Needs await to catch in here.
  } catch (error) {
    return { error: true }
  }
}

export const authenticate = async (name: string) => {
  const baseUrl = app.authenticateUrl || joinUrl('/authenticate')
  const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
  const fetchConfiguration = isReactNative
    ? {
        headers: { referer: 'https://iltio.com' },
      }
    : {}

  const response = await fetchWithError(
    `${baseUrl}?name=${encodeURIComponent(name)}${app.apiToken ? `&token=${app.apiToken}` : ''}`,
    fetchConfiguration,
  )

  return response as {
    error: boolean | string
    codeToken?: string
    registration?: boolean
    // Anonymous registration.
    token?: string
    id: string
    uid: string
  }
}

export const poll = async () => {
  const response = await fetchWithError(joinUrl(`/verify/poll?token=${Store.codeToken}`))

  return response as {
    error: boolean | string
    token?: string
    jsonWebToken?: string
    encrypted?: boolean
    encryptionText?: string
    userId?: string
    uid?: string
  }
}

export const confirm = async (code: string) => {
  const response = await fetchWithError(
    joinUrl(`/verify/confirm?code=${encodeURIComponent(code)}&token=${Store.codeToken}`),
  )

  return response as {
    error: boolean | string
    token?: string
    jsonWebToken?: string
    encrypted?: boolean
    encryptionText?: string
    userId?: string
    uid?: string
  }
}

export const resend = async (token = Store.codeToken) => {
  const response = await fetchWithError(
    joinUrl(`/resend-code?name=${encodeURIComponent(Store.name)}&token=${token}`),
  )

  return response as {
    error: boolean | string
  }
}

export const authorize = async (token = Store.token) => {
  const response = await fetchWithError(joinUrl(`/authorize?token=${token}`))

  return response as { error: boolean; role: string; id: string; uid: string; name: string }
}

export const logout = async (server = false, token = Store.token) => {
  Store.removeToken()
  Store.removeName()
  Store.removeEncryptionKey()
  Store.removeUid()
  Store.removeJsonWebToken()
  removeCryptoKey()

  if (server) {
    const response = await fetchWithError(joinUrl(`/logout?token=${token}`))
    return response as { error: boolean }
  }

  return { error: false }
}

export const remove = async (token = Store.token) => {
  if (!token) {
    // eslint-disable-next-line no-console
    return console.error('No user logged in or token provided.')
  }

  const response = await fetchWithError(joinUrl(`/delete?token=${token}`))

  Store.removeToken()
  Store.removeName()
  Store.removeEncryptionKey()
  Store.removeUid()
  Store.removeJsonWebToken()
  return response as { error: boolean }
}

export const log = async (message: string, eventId: number) => {
  const response = await fetchWithError(joinUrl(`/logs?id=${encodeURIComponent(eventId)}`), {
    method: 'POST',
    body: JSON.stringify({ data: message }),
  })

  return response as {
    error: boolean
  }
}

export const user = async (token = Store.token) => {
  const response = await fetchWithError(joinUrl(`/user?token=${token}`))

  return response as {
    error: boolean
    id: string
    uid: string
    encrypted: boolean
    encryptionText: string
  }
}

export const rootUser = async (token = Store.token) => {
  const response = await fetchWithError(joinUrl(`/internal/user?token=${token}`))

  return response as {
    error: boolean
    id: string
    uid: string
    allowMail: boolean
    allowPhone: boolean
    allowAnonymousRegistration: boolean
    allowRecoveryToken: boolean
    users: { name: string; createdAt: Date }[]
  }
}

export const toggleEncryption = async (token = Store.token, text?: string) => {
  const response = await fetchWithError(joinUrl(`/encrypt?token=${token}&text=${text}`), {
    method: 'PUT',
  })

  return response as {
    error: boolean
    encrypted: boolean
  }
}

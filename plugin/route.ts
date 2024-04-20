import { app, Store } from './store'
import { joinUrl } from './helper'

async function handleError(response: Response) {
  try {
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

  const response = await fetch(
    `${baseUrl}?name=${encodeURIComponent(name)}${app.apiToken ? `&token=${app.apiToken}` : ''}`,
    fetchConfiguration,
  )

  if (!response.ok) {
    return await handleError(response)
  }

  return response.json() as Promise<{
    error: boolean | string
    codeToken?: string
    registration?: boolean
  }>
}

export const poll = async () => {
  const response = await fetch(joinUrl(`/verify/poll?token=${Store.codeToken}`))

  if (!response.ok) {
    return await handleError(response)
  }

  return response.json() as Promise<{
    error: boolean | string
    token?: string
  }>
}

export const confirm = async (code: string) => {
  const response = await fetch(
    joinUrl(`/verify/confirm?code=${encodeURIComponent(code)}&token=${Store.codeToken}`),
  )

  if (!response.ok) {
    return await handleError(response)
  }

  return response.json() as Promise<{
    error: boolean | string
    token?: string
  }>
}

export const resend = async (token = Store.codeToken) => {
  const response = await fetch(
    joinUrl(`/resend-code?name=${encodeURIComponent(Store.name)}&token=${token}`),
  )

  if (!response.ok) {
    return await handleError(response)
  }

  return response.json() as Promise<{
    error: boolean | string
  }>
}

export const authorize = async (token = Store.token) => {
  const response = await fetch(joinUrl(`/authorize?token=${token}`))

  if (!response.ok) {
    return await handleError(response)
  }

  const { error, role, id, name } = await response.json()
  return { error, role, id, name }
}

export const logout = async (server = false, token = Store.token) => {
  Store.removeToken()
  Store.removeName()

  if (server) {
    const response = await fetch(joinUrl(`/logout?token=${token}`))

    if (!response.ok) {
      return await handleError(response)
    }

    const { error } = await response.json()
    return { error }
  }

  return { error: false }
}

export const remove = async (token = Store.token) => {
  if (!token) {
    // eslint-disable-next-line no-console
    return console.error('No user logged in or token provided.')
  }

  const response = await fetch(joinUrl(`/delete?token=${token}`))

  if (!response.ok) {
    return await handleError(response)
  }

  const { error } = await response.json()
  Store.removeToken()
  Store.removeName()
  return { error }
}

export const log = async (message: string, eventId: number) => {
  const response = await fetch(joinUrl(`/logs?id=${encodeURIComponent(eventId)}`), {
    method: 'POST',
    body: JSON.stringify({ data: message }),
  })

  if (!response.ok) {
    return await handleError(response)
  }

  return response.json() as Promise<{
    error: boolean
  }>
}

import { app, Store } from './store'

export const authenticate = async (name: string) => {
  const baseUrl = app.authenticateUrl || `${app.apiUrl}/authenticate`
  const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
  const fetchConfiguration = isReactNative
    ? {
        referrer: isReactNative ? 'https://iltio.com' : undefined,
        headers: { referer: 'https://iltio.com' },
      }
    : {}

  const response = await fetch(
    `${baseUrl}?name=${encodeURIComponent(name)}${app.apiToken ? `&token=${app.apiToken}` : ''}`,
    fetchConfiguration
  )

  return response.json() as Promise<{
    error: boolean | string
    pollLink?: string
    codeToken?: string
    registration?: boolean
  }>
}

export const poll = async () => {
  const response = await fetch(`${app.apiUrl}/verify/poll?token=${Store.codeToken}`)

  return response.json() as Promise<{
    error: boolean | string
    token?: string
  }>
}

export const confirm = async (code: string) => {
  const response = await fetch(
    `${app.apiUrl}/verify/confirm?code=${encodeURIComponent(code)}&token=${Store.codeToken}`
  )

  return response.json() as Promise<{
    error: boolean | string
    token?: string
  }>
}

export const resend = async (token = Store.codeToken) => {
  const response = await fetch(
    `${app.apiUrl}/resend-code?name=${encodeURIComponent(Store.name)}&token=${token}`
  )

  return response.json() as Promise<{
    error: boolean | string
    pollLink?: string
  }>
}

export const authorize = async (token = Store.token) => {
  const response = await fetch(`${app.apiUrl}/authorize?token=${token}`)
  const { error, role, id, name } = await response.json()

  return { error, role, id, name }
}

export const logout = async (server = false, token = Store.token) => {
  Store.removeToken()
  Store.removeName()

  if (server) {
    const response = await fetch(`${app.apiUrl}/logout?token=${token}`)
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

  const response = await fetch(`${app.apiUrl}/delete?token=${token}`)
  const { error } = await response.json()

  Store.removeToken()
  Store.removeName()

  return { error }
}

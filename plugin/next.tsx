import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie, setCookie, deleteCookie, hasCookie } from 'cookies-next'
import { joinUrl } from './helper.js'

const inferRouteFromPath = (path: string | string[] | undefined) => {
  if (!path) return ''
  if (!Array.isArray(path)) {
    path = [path]
  }
  const lastIndex = path.length - 1
  return path[lastIndex]
}

const isRelativeUrl = (url: string) => url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0

type Options = {
  referrer?: string
  verifyPage?: string
  sameSite?: boolean | 'lax' | 'none' | 'strict'
  path?: string
  maxAge?: number
  secure?: boolean
  httpOnly?: boolean
}

export const createHandler = (inputs: Options = {}) =>
  async function handler(request: NextApiRequest, response: NextApiResponse<any>) {
    const { referrer, verifyPage, ...cookieOptions } = inputs
    const addCookie = (key: string, value: string) =>
      setCookie(key, value, {
        req: request,
        res: response,
        sameSite: true,
        secure: true,
        httpOnly: true,
        ...cookieOptions,
      })

    const { path, ...queryParameters } = request.query
    const route = inferRouteFromPath(path)
    const authenticateRoute = route === 'authenticate' || route === 'resend-code'
    const verifyRoute = route === 'confirm' || route === 'poll'

    if (!Array.isArray(path)) {
      return response.status(500).json({ error: 'Invalid path.' })
    }

    if (route === 'logout' || route === 'delete') {
      deleteCookie('auth-token', { req: request, res: response })
      deleteCookie('auth-verify-token', { req: request, res: response })
      deleteCookie('auth-name', { req: request, res: response })
    }

    // Move codeToken to query params (relevant for HTTP only cookies).
    if (
      verifyRoute &&
      !queryParameters.token &&
      hasCookie('auth-verify-token', { req: request, res: response })
    ) {
      queryParameters.token = getCookie('auth-verify-token', {
        req: request,
        res: response,
      }) as string
    }

    const tokenCookie = getCookie('auth-token', { req: request, res: response })

    // Move token from cookie to GET parameters.
    if (typeof tokenCookie === 'string' && tokenCookie.length !== 0) {
      const authorizeResponse = await (
        await fetch(`https://iltio.com/api/authorize?token=${encodeURIComponent(tokenCookie)}`)
      ).json()

      if (authorizeResponse.error || authorizeResponse.role !== 'user') {
        // Remove expired or invalid tokens.
        deleteCookie('auth-token', { req: request, res: response })
      } else {
        queryParameters.token = tokenCookie as string
      }
    }

    if (authenticateRoute && verifyPage) {
      if (isRelativeUrl(verifyPage) && request.headers.referer) {
        queryParameters['verify-page'] = joinUrl(verifyPage, request.headers.referer)
      } else {
        queryParameters['verify-page'] = verifyPage
      }
    }

    const stringParameters = new URLSearchParams(queryParameters as any).toString()

    const url = `https://iltio.com/api/${path.join('/')}?${stringParameters}`
    const options = {
      headers: {
        referer: referrer ?? request.headers.referer ?? 'https://iltio.com',
      },
    }

    const fetchResponse = await fetch(url, options)
    const { token, codeToken, ...data } = await fetchResponse.json()

    if (verifyRoute && token && token.length === 64) {
      addCookie('auth-token', token)
      data.token = 'next'

      if (hasCookie('auth-verify-token', { req: request, res: response })) {
        deleteCookie('auth-verify-token', { req: request, res: response })
      }
    }

    if (route === 'authenticate' && codeToken && codeToken.length === 64) {
      addCookie('auth-verify-token', codeToken)

      if (typeof queryParameters.name === 'string') {
        addCookie('auth-name', queryParameters.name)
      }
    }

    response.status(200).json(data)
  }

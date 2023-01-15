import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

// TODO can this be abstracted easily?
export const middleware = () => {}

type Data = {
  error?: string | boolean
}

export async function handler(request: NextApiRequest, response: NextApiResponse<Data>) {
  const { path, ...queryParameters } = request.query

  if (!Array.isArray(path)) {
    return response.status(500).json({ error: 'Invalid path.' })
  }

  if (path.includes('logout')) {
    deleteCookie('auth-token', { req: request, res: response })
    deleteCookie('auth-verify-token', { req: request, res: response })
    deleteCookie('auth-name', { req: request, res: response })
    return response.status(200).json({ error: false })
  }

  const tokenCookie = getCookie('auth-token', { req: request, res: response })

  if (tokenCookie) {
    // TODO set only for certain routes?
    queryParameters.token = tokenCookie as string
  }

  const stringParameters = new URLSearchParams(queryParameters as any).toString()

  const url = `https://iltio.com/api/${path.join('/')}?${stringParameters}`
  const options = {
    // TODO this doesn't work, fix in iltio-server
    referrer: 'https://iltio-next-demo.vercel.app',
    headers: {
      referer: 'https://iltio-next-demo.vercel.app',
    },
  }

  const fetchResponse = await fetch(url, options)
  const { token, codeToken, ...data } = await fetchResponse.json()

  // TODO setCookie sameSite and secure options?

  if (path.includes('verify') && token && token.length === 64) {
    setCookie('auth-token', token, { req: request, res: response })
    data.token = 'next'
  }

  if (path.includes('authenticate') && codeToken && codeToken.length === 64) {
    setCookie('auth-verify-token', codeToken, { req: request, res: response })

    if (typeof queryParameters.name === 'string') {
      setCookie('auth-name', queryParameters.name, {
        req: request,
        res: response,
      })
    }
  }

  response.status(200).json(data)
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authorize } from 'iltio'

export async function middleware(request: NextRequest) {
  const route = request.nextUrl.pathname
  const token = request.cookies.get('auth-token')?.value
  const noToken = typeof token !== 'string' || token.length !== 64

  // Authentication protected page.
  if (route === '/user' && noToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (route === '/' && noToken) {
    return NextResponse.next()
  }

  if (route !== '/user' && route !== '/' && noToken) {
    return NextResponse.json({ error: 'Please authenticate.' })
  }

  // Check if token valid.
  const { error, role } = await authorize(token)
  const isAuthorized = !error && role === 'user'

  if (route === '/' && isAuthorized) {
    return NextResponse.redirect(new URL('/user', request.url))
  }

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Failed to authorize.' })
  }

  return NextResponse.next()
}

export const config = {
  // All routes protected except authentication & public routes.
  matcher: ['/', '/user', '/api/((?!authentication|public).*)'],
}

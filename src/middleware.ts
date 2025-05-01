import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/_next', '/favicon.ico']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Skip public routes
  if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.next()
  }

  // Verify auth
  const accessToken = request.cookies.get('accessToken')?.value
  const isValidToken = accessToken && !isTokenExpired(accessToken)

  if (!isValidToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

function isTokenExpired(token: string) {
  try {
    const { exp } = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabaseServer'

const PROTECTED_PATHS = ['/admin']
const LOGIN_PATH = '/login'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isLoginRoute = pathname.startsWith(LOGIN_PATH)

  // Only run auth logic for admin and login routes
  if (!isProtected && !isLoginRoute) {
    return response
  }

  const supabase = createSupabaseMiddlewareClient(request, response)

  // If Supabase is not configured, block admin access entirely
  if (!supabase) {
    if (isProtected) {
      const loginUrl = new URL(LOGIN_PATH, request.url)
      loginUrl.searchParams.set('error', 'config')
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users away from admin
  if (isProtected && (error || !user)) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login to admin
  if (isLoginRoute && user && !error) {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/admin'
    return NextResponse.redirect(new URL(redirect, request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login/:path*'],
}

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabaseServer'

const PROTECTED_PATHS = ['/admin']
const LOGIN_PATH = '/login'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Only protect admin routes
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  if (!isProtected) {
    return response
  }

  const supabase = createSupabaseMiddlewareClient(request, response)

  // If Supabase is not configured, block admin access entirely
  if (!supabase) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('error', 'config')
    return NextResponse.redirect(loginUrl)
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // User is authenticated — allow access
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}

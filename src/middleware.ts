import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar se é uma rota protegida
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const isAuthenticated = request.cookies.get('authenticated')?.value === 'true'
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirecionar usuários autenticados da página de login
  if (request.nextUrl.pathname === '/login') {
    const isAuthenticated = request.cookies.get('authenticated')?.value === 'true'
    
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
} 
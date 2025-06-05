import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations'
import { isValidAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }

    const { email, password } = validation.data

    if (!isValidAdmin(email, password)) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const response = NextResponse.json({ message: 'Login realizado com sucesso' })
    
    // Definir cookie de autenticação
    response.cookies.set('authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    })

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 
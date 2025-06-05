import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createBlockedUrlSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        blockedUrls: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json(user.blockedUrls)
  } catch (error) {
    console.error('Erro ao buscar URLs bloqueadas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    const body = await request.json()

    const validation = createBlockedUrlSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }

    const { url } = validation.data

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verificar se a URL já está bloqueada para este usuário
    const existingBlockedUrl = await prisma.blockedUrl.findUnique({
      where: {
        url_userId: {
          url,
          userId
        }
      }
    })

    if (existingBlockedUrl) {
      return NextResponse.json({ error: 'URL já está bloqueada para este usuário' }, { status: 409 })
    }

    const blockedUrl = await prisma.blockedUrl.create({
      data: {
        url,
        userId
      }
    })

    return NextResponse.json(blockedUrl, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar URL bloqueada:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 
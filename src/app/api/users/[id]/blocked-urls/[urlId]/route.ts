import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; urlId: string }> }
) {
  try {
    const { id: userId, urlId } = await params

    // Verificar se a URL bloqueada existe e pertence ao usuário
    const blockedUrl = await prisma.blockedUrl.findUnique({
      where: {
        id: urlId
      }
    })

    if (!blockedUrl) {
      return NextResponse.json({ error: 'URL bloqueada não encontrada' }, { status: 404 })
    }

    if (blockedUrl.userId !== userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    await prisma.blockedUrl.delete({
      where: {
        id: urlId
      }
    })

    return NextResponse.json({ message: 'URL removida com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar URL bloqueada:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 
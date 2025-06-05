'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '@/components/Layout'
import { createBlockedUrlSchema, type CreateBlockedUrlInput } from '@/lib/validations'

interface BlockedUrl {
  id: string
  url: string
  createdAt: string
}

interface User {
  id: string
  email: string
  createdAt: string
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [blockedUrls, setBlockedUrls] = useState<BlockedUrl[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateBlockedUrlInput>({
    resolver: zodResolver(createBlockedUrlSchema)
  })

  const fetchUserData = useCallback(async () => {
    try {
      // Buscar dados do usuário
      const userResponse = await fetch(`/api/users`)
      if (userResponse.ok) {
        const users = await userResponse.json()
        const currentUser = users.find((u: User) => u.id === userId)
        if (currentUser) {
          setUser(currentUser)
        } else {
          setError('Usuário não encontrado')
          return
        }
      }

      // Buscar URLs bloqueadas
      const urlsResponse = await fetch(`/api/users/${userId}/blocked-urls`)
      if (urlsResponse.ok) {
        const urls = await urlsResponse.json()
        setBlockedUrls(urls)
      } else {
        setError('Erro ao carregar URLs bloqueadas')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const onSubmit = async (data: CreateBlockedUrlInput) => {
    setIsCreating(true)
    setError('')

    try {
      const response = await fetch(`/api/users/${userId}/blocked-urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const newUrl = await response.json()
        setBlockedUrls(prev => [newUrl, ...prev])
        reset()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao adicionar URL')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUrl = async (urlId: string) => {
    if (!confirm('Tem certeza que deseja remover esta URL?')) return

    try {
      const response = await fetch(`/api/users/${userId}/blocked-urls/${urlId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBlockedUrls(prev => prev.filter(url => url.id !== urlId))
      } else {
        setError('Erro ao remover URL')
      }
    } catch {
      setError('Erro de conexão')
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId, fetchUserData])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Usuário não encontrado</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            ← Voltar ao Dashboard
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{user.email}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Usuário criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Formulário para adicionar URL */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Adicionar URL Bloqueada</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                {...register('url')}
                type="url"
                placeholder="https://exemplo.com"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isCreating ? 'Adicionando...' : 'Adicionar'}
            </button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Lista de URLs bloqueadas */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              URLs Bloqueadas ({blockedUrls.length})
            </h2>
            {blockedUrls.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma URL bloqueada</p>
            ) : (
              <div className="space-y-4">
                {blockedUrls.map((blockedUrl) => (
                  <div
                    key={blockedUrl.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {blockedUrl.url}
                      </p>
                      <p className="text-xs text-gray-500">
                        Adicionada em: {new Date(blockedUrl.createdAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(blockedUrl.createdAt).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteUrl(blockedUrl.id)}
                      className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
} 
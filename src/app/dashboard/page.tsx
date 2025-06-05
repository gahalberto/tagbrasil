'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '@/components/Layout'
import { createUserSchema, type CreateUserInput } from '@/lib/validations'

interface User {
  id: string
  email: string
  createdAt: string
  _count: {
    blockedUrls: number
  }
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema)
  })

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError('Erro ao carregar usuários')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CreateUserInput) => {
    setIsCreating(true)
    setError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const newUser = await response.json()
        setUsers(prev => [newUser, ...prev])
        reset()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao criar usuário')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setIsCreating(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
            <p className="mt-2 text-sm text-gray-700">
              Lista de usuários e suas URLs bloqueadas
            </p>
          </div>
        </div>

        {/* Formulário para criar usuário */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Adicionar Novo Usuário</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                {...register('email')}
                type="email"
                placeholder="Email do usuário"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isCreating ? 'Criando...' : 'Adicionar'}
            </button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Lista de usuários */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Lista de Usuários</h2>
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum usuário encontrado</p>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => window.location.href = `/dashboard/users/${user.id}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{user.email}</h3>
                        <p className="text-sm text-gray-500">
                          Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {user._count.blockedUrls} URLs bloqueadas
                        </span>
                      </div>
                    </div>
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
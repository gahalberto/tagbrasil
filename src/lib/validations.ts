import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const createBlockedUrlSchema = z.object({
  url: z.string().url('URL inválida'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateBlockedUrlInput = z.infer<typeof createBlockedUrlSchema>
export type LoginInput = z.infer<typeof loginSchema> 
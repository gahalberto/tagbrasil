import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function isValidAdmin(email: string, password: string): boolean {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD
} 
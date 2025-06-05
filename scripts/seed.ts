import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuários de exemplo
  const user1 = await prisma.user.upsert({
    where: { email: 'joao@exemplo.com' },
    update: {},
    create: {
      email: 'joao@exemplo.com',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'maria@exemplo.com' },
    update: {},
    create: {
      email: 'maria@exemplo.com',
    },
  })

  // Criar URLs bloqueadas de exemplo
  await prisma.blockedUrl.createMany({
    data: [
      {
        url: 'https://facebook.com',
        userId: user1.id,
      },
      {
        url: 'https://instagram.com',
        userId: user1.id,
      },
      {
        url: 'https://twitter.com',
        userId: user1.id,
      },
      {
        url: 'https://youtube.com',
        userId: user2.id,
      },
      {
        url: 'https://tiktok.com',
        userId: user2.id,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seed concluído!')
  console.log(`👤 Usuário 1: ${user1.email} (ID: ${user1.id})`)
  console.log(`👤 Usuário 2: ${user2.email} (ID: ${user2.id})`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
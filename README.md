# Content Filter Dashboard

Painel web para controlar URLs bloqueadas por usuário, desenvolvido com Next.js, TypeScript, Prisma e Tailwind CSS.

## 🚀 Funcionalidades

- **Autenticação básica** para proteger o painel
- **Gerenciamento de usuários** - criar e listar usuários
- **Controle de URLs bloqueadas** - adicionar e remover URLs por usuário
- **Interface moderna** com Tailwind CSS
- **Validação de formulários** com React Hook Form e Zod
- **Banco PostgreSQL** com Docker

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de dados**: PostgreSQL com Prisma ORM
- **Validação**: Zod + React Hook Form
- **Containerização**: Docker (PostgreSQL)

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd content-filter-dashboard
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
O arquivo `.env` já foi criado com as configurações padrão:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/content_filter?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
ADMIN_EMAIL="admin@admin.com"
ADMIN_PASSWORD="admin123"
```

### 4. Inicie o banco PostgreSQL
```bash
docker-compose up -d
```

### 5. Configure o banco de dados
```bash
# Aplicar schema ao banco
npx prisma db push

# Gerar Prisma Client
npx prisma generate

# Popular com dados de exemplo (opcional)
npm run db:seed
```

### 6. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🔐 Acesso ao Sistema

### Credenciais padrão:
- **Email**: admin@admin.com
- **Senha**: admin123

## 📖 Como usar

### 1. Login
- Acesse `http://localhost:3000`
- Será redirecionado para `/login`
- Use as credenciais padrão para entrar

### 2. Dashboard Principal
- Lista todos os usuários cadastrados
- Mostra quantidade de URLs bloqueadas por usuário
- Permite adicionar novos usuários

### 3. Gerenciar URLs de um usuário
- Clique em um usuário na lista
- Visualize todas as URLs bloqueadas
- Adicione novas URLs
- Remova URLs existentes

## 🔌 API Endpoints

### Usuários
- `GET /api/users` - Lista todos os usuários
- `POST /api/users` - Cria um novo usuário

### URLs Bloqueadas
- `GET /api/users/[id]/blocked-urls` - Lista URLs bloqueadas do usuário
- `POST /api/users/[id]/blocked-urls` - Adiciona URL bloqueada
- `DELETE /api/users/[id]/blocked-urls/[urlId]` - Remove URL bloqueada

### Autenticação
- `POST /api/auth/login` - Realiza login
- `POST /api/auth/logout` - Realiza logout

## 🗄️ Estrutura do Banco

### Tabela `users`
- `id` (String, PK)
- `email` (String, unique)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Tabela `blocked_urls`
- `id` (String, PK)
- `url` (String)
- `userId` (String, FK)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- Constraint única: `(url, userId)`

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Linting
npm run lint

# Popular banco com dados de exemplo
npm run db:seed
```

## 🐳 Docker

O projeto inclui configuração Docker para PostgreSQL:

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Parar PostgreSQL
docker-compose down

# Parar e remover volumes (limpar dados)
docker-compose down -v
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/                 # API Routes
│   ├── dashboard/           # Páginas do dashboard
│   ├── login/              # Página de login
│   └── page.tsx            # Página inicial
├── components/             # Componentes React
├── lib/                   # Utilitários e configurações
│   ├── prisma.ts          # Configuração Prisma
│   ├── validations.ts     # Schemas Zod
│   └── auth.ts           # Utilitários de autenticação
└── middleware.ts         # Middleware de autenticação

prisma/
└── schema.prisma         # Schema do banco

scripts/
└── seed.ts              # Script para popular banco
```

## 🔒 Segurança

- Autenticação baseada em cookies HTTP-only
- Middleware para proteger rotas
- Validação de entrada com Zod
- Sanitização de URLs

## 🚀 Deploy

Para deploy em produção:

1. Configure as variáveis de ambiente adequadas
2. Use um banco PostgreSQL em produção
3. Execute `npm run build`
4. Configure `NEXTAUTH_SECRET` com valor seguro
5. Configure credenciais de admin seguras

## 📝 Licença

Este projeto é apenas para fins educacionais e demonstração.

# Backend - NestJS + Prisma + MySQL

## Instalação

```bash
npm install
cp .env.example .env
# edite o .env com DATABASE_URL e JWT_SECRET
```

## Banco de dados (Prisma)

```bash
# Gera o client Prisma a partir do schema
npx prisma generate

# Cria as tabelas no banco (cria migração e aplica)
npx prisma migrate dev --name init

# Popula com usuário admin (admin@faculdade.edu.br / admin123)
npm run prisma:seed

# Opcional: abre o Prisma Studio para inspecionar o banco
npm run prisma:studio
```

## Executar

```bash
npm run start:dev     # modo desenvolvimento (hot-reload)
npm run start         # modo produção (precisa build antes)
npm run build         # gera dist/
```

A API sobe em `http://localhost:3000/api`.
Swagger interativo em `http://localhost:3000/api/docs`.

## Testes

```bash
npm test
```

## Variáveis de ambiente

| Variável | Exemplo | Descrição |
|---|---|---|
| `DATABASE_URL` | `mysql://user:pass@localhost:3306/agendamento_db` | Conexão MySQL |
| `PORT` | `3000` | Porta do servidor |
| `JWT_SECRET` | `qualquer-string-longa-aleatoria` | Segredo de assinatura JWT |
| `JWT_EXPIRES_IN` | `1d` | Expiração do token |
| `CORS_ORIGIN` | `http://localhost:5173` | Origem permitida pelo CORS |
